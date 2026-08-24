package com.jobportal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;
    private String salary;
    private String description;
    public Job() {
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public String getTitle() {
    return title;
}

public void setTitle(String title) {
    this.title = title;
}

public String getCompany() {
    return company;
}

public void setCompany(String company) {
    this.company = company;
}

public String getLocation() {
    return location;
}

public void setLocation(String location) {
    this.location = location;
}

public String getSalary() {
    return salary;
}

public void setSalary(String salary) {
    this.salary = salary;
}

public String getDescription() {
    return description;
}

public void setDescription(String description) {
    this.description = description;
}
}