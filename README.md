# Tuition Media Platform Only for CUET

## Description

The Tuition Media Platform is a web application developed to facilitate the connection between tutors and guardians for tuition opportunities. It leverages React, Redux Toolkit (RTK), Express.js, and PostgreSQL to create a robust and secure platform with features such as dual authentication, tutor verification workflow, guardian tuition postings, and more.This repository contains server side code only

## Features

### 1. User Authentication

- Implemented JWT-based authentication for secure user login.
- Provided dual signup options for users: signup as a tutor or guardian.

### 2. Tutor Verification Workflow

- Restricted tutor signup to individuals associated with a specific institution.
- Required tutors to submit ID card front and back images during signup.
- Admin panel functionality to review and approve/reject tutor requests based on institution validation.

### 3. Guardian Tution Postings

- Guardians can post tuition opportunities with details like location, salary, subjects, etc.
- Admin approval process for guardian tuition postings, ensuring data accuracy.

### 4. Tutor Interaction

- Tutors can view all available tuition posts, filtered by criteria such as salary, location, etc.
- Application restriction: Tutors can apply to a tuition only once.
- Multiple tutors can apply for the same tuition.

### 5. Guardian Application Management

- Guardians can view all tutor applications for their posted tuitions.
- Capability for guardians to assign a tuition to a specific tutor, automatically rejecting other applicants.

### 6. Admin Panel

- Admin controls for validating tutor requests and approving guardian tuition postings.
- Streamlined workflows for efficient management of user and tuition-related data.

## Technologies Used

- React: Front-end library for building responsive user interfaces.
- Redux Toolkit (RTK): State management for React applications.
- Express.js: Backend framework for building robust server-side applications.
- PostgreSQL: Relational database for efficient data storage and retrieval.

## Achievements

- Successfully implemented a role-based authentication system with JWT.
- Developed a secure and efficient tutor verification process.
- Enhanced user experience with advanced filtering options for tutors and guardians.

## Project Outcome

The Tuition Media Platform demonstrated my ability to create a secure, role-based web application with complex workflows, contributing to improved efficiency in the tutor-guardian matching process.
