package com.jobportal.repository;

import com.jobportal.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByTitleContainingIgnoreCase(String title);

    List<Job> findByCompanyContainingIgnoreCase(String company);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String title,
            String location
    );
}