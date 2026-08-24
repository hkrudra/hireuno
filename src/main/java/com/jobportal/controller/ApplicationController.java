package com.jobportal.controller;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationController(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> applyForJob(
            @RequestBody Application application,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = getToken(authorizationHeader);

        Long userId = JwtUtil.extractUserId(token);
        String role = JwtUtil.extractRole(token);

        if (!role.equalsIgnoreCase("USER")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only USER can apply for jobs"
                    ));
        }

        application.setUserId(userId);

        boolean alreadyApplied =
                applicationRepository.existsByUserIdAndJobId(
                        userId,
                        application.getJobId()
                );

        if (alreadyApplied) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "You have already applied for this job"
                    ));
        }

        application.setStatus("APPLIED");

        Application savedApplication =
                applicationRepository.save(application);

        return ResponseEntity.ok(savedApplication);
    }

    @GetMapping
    public ResponseEntity<?> getAllApplications(
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = getToken(authorizationHeader);
        String role = JwtUtil.extractRole(token);

        if (!role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only ADMIN can view all applications"
                    ));
        }

        List<Application> applications =
                applicationRepository.findAll();

        List<Map<String, Object>> response =
                new ArrayList<>();

        for (Application application : applications) {

            User user =
                    userRepository.findById(application.getUserId())
                            .orElse(null);

            Job job =
                    jobRepository.findById(application.getJobId())
                            .orElse(null);

            Map<String, Object> item =
                    new LinkedHashMap<>();

            item.put(
                    "applicationId",
                    application.getId()
            );

            item.put(
                    "status",
                    application.getStatus()
            );

            item.put(
                    "userId",
                    application.getUserId()
            );

            item.put(
                    "jobId",
                    application.getJobId()
            );

            if (user != null) {
                item.put(
                        "candidateName",
                        user.getName()
                );

                item.put(
                        "candidateEmail",
                        user.getEmail()
                );
            }

            if (job != null) {
                item.put(
                        "jobTitle",
                        job.getTitle()
                );

                item.put(
                        "company",
                        job.getCompany()
                );

                item.put(
                        "location",
                        job.getLocation()
                );
            }

            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = getToken(authorizationHeader);

        Long userId = JwtUtil.extractUserId(token);
        String role = JwtUtil.extractRole(token);

        if (!role.equalsIgnoreCase("USER")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only USER can view own applications"
                    ));
        }

        List<Application> applications =
                applicationRepository.findByUserId(userId);

        List<Map<String, Object>> response =
                new ArrayList<>();

        for (Application application : applications) {

            Job job =
                    jobRepository.findById(application.getJobId())
                            .orElse(null);

            Map<String, Object> item =
                    new LinkedHashMap<>();

            item.put(
                    "applicationId",
                    application.getId()
            );

            item.put(
                    "jobId",
                    application.getJobId()
            );

            item.put(
                    "status",
                    application.getStatus()
            );

            if (job != null) {
                item.put(
                        "title",
                        job.getTitle()
                );

                item.put(
                        "company",
                        job.getCompany()
                );

                item.put(
                        "location",
                        job.getLocation()
                );

                item.put(
                        "salary",
                        job.getSalary()
                );

                item.put(
                        "description",
                        job.getDescription()
                );
            }

            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = getToken(authorizationHeader);
        String role = JwtUtil.extractRole(token);

        if (!role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only ADMIN can update application status"
                    ));
        }

        Application application =
                applicationRepository.findById(id)
                        .orElse(null);

        if (application == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Application not found"
                    ));
        }

        application.setStatus(status);

        return ResponseEntity.ok(
                applicationRepository.save(application)
        );
    }

    private String getToken(
            String authorizationHeader) {

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            throw new RuntimeException(
                    "Invalid Authorization header"
            );
        }

        return authorizationHeader.substring(7);
    }
}