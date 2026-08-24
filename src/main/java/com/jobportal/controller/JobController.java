package com.jobportal.controller;

import com.jobportal.model.Job;
import com.jobportal.repository.JobRepository;
import com.jobportal.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/search")
    public List<Job> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String location) {

        if (title != null && location != null) {
            return jobRepository
                    .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
                            title,
                            location
                    );
        }

        if (title != null) {
            return jobRepository.findByTitleContainingIgnoreCase(title);
        }

        if (company != null) {
            return jobRepository.findByCompanyContainingIgnoreCase(company);
        }

        if (location != null) {
            return jobRepository.findByLocationContainingIgnoreCase(location);
        }

        return jobRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createJob(
            @RequestBody Job job,
            @RequestHeader("Authorization") String authorizationHeader) {

        String role = getRoleFromToken(authorizationHeader);

        if (!role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only ADMIN can create jobs"
                    ));
        }

        Job savedJob = jobRepository.save(job);

        return ResponseEntity.ok(savedJob);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long id,
            @RequestBody Job updatedJob,
            @RequestHeader("Authorization") String authorizationHeader) {

        String role = getRoleFromToken(authorizationHeader);

        if (!role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only ADMIN can update jobs"
                    ));
        }

        Job job = jobRepository.findById(id).orElse(null);

        if (job == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Job not found"
                    ));
        }

        job.setTitle(updatedJob.getTitle());
        job.setCompany(updatedJob.getCompany());
        job.setLocation(updatedJob.getLocation());
        job.setSalary(updatedJob.getSalary());
        job.setDescription(updatedJob.getDescription());

        return ResponseEntity.ok(
                jobRepository.save(job)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader) {

        String role = getRoleFromToken(authorizationHeader);

        if (!role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only ADMIN can delete jobs"
                    ));
        }

        if (!jobRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Job not found"
                    ));
        }

        jobRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Job deleted successfully"
                )
        );
    }

    private String getRoleFromToken(String authorizationHeader) {

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            throw new RuntimeException(
                    "Invalid Authorization header"
            );
        }

        String token = authorizationHeader.substring(7);

        return JwtUtil.extractRole(token);
    }
}