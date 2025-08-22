Project Type:** Web Application
**Target Audience:** Nigerians in the diaspora sending money for projects at home
**Primary Objective:** Provide trustworthy, transparent, and visual verification services for diaspora-funded projects through a centralized in-house team.

---

## **1. Project Overview**

Many Nigerians living abroad regularly send money home to support construction projects, vehicle purchases, business setups, or other forms of local development. However, a major challenge exists — **trust**. Due to distance, communication barriers, and frequent cases of mismanagement, many diaspora individuals are left uncertain about the true progress or even existence of their funded projects.

**ProjectVerify** is a web platform that bridges this trust gap. It allows diaspora users to submit verification requests for any project they’ve funded back home. Once a request is received, a trusted in-house team is dispatched to the project site to capture timestamped, geotagged photos or videos. These media files are then uploaded securely to the user’s dashboard, giving them peace of mind, clarity, and control.

---

## **2. Key Stakeholders & User Roles**

### **2.1 Diaspora User (Client)**

* Registers/logs into the web app
* Creates project profile (name, description, location, etc)
* Submits verification request
* Receives notification when verification is completed
* Views project proof (media, comments, timestamps)


## **3. Core Features**

### **3.1 User Dashboard**

* View submitted projects
* Request new verification
* Track request status (Pending, In Progress, Verified)
* Media gallery for each project
* Optional comment thread or notes section

### **3.3 Media Upload System**

* Upload images/videos from local device
* Metadata extraction (timestamp, location)
* Secure storage (via Supabase Storage)

### **3.4 Notifications**

* Email  alert to user when:

  * Request is received
  * Verification is completed
  * Any issues arise (e.g. incorrect address)

### **3.5 Security and Compliance**

* Two-factor authentication (2FA) for users and admins
* GDPR & NDPR compliance for data handling
* Secure file uploads and private media access



## **5. System Architecture**

* **Frontend:**

  * Built with Next.js
  * User-facing pages (dashboard, project form, gallery)
  * Admin interface for uploading media and managing requests

* **Backend:**

  * Supabase handles authentication, database, and file storage
  * Role-based access (user vs admin)
  * RESTful APIs to fetch project and media data


## **6. User Journey**

1. **Sign Up / Log In**
2. **Create Project Profile** (Title, Location, Description)
3. **Request Verification** (Select project, add note)
4. **Admin Reviews Request** (assigns for in-house visit)
5. **Verification Team Visits Site** (photos/videos taken)
6. **Admin Uploads Proof** (via Admin panel)
7. **User Receives Notification & Views Update**

---

## **7. Future Enhancements**

* Mobile App version (React Native or Flutter)
* Live chat between user and admin
* Video streaming support
* Request scheduling and auto-reminders


## **9. Final Notes**

ProjectVerify addresses a real-world pain point for diaspora communities, offering them reassurance and transparency. The MVP is focused, functional, and scalable — allowing for easy updates, secure handling of media files, and smooth user interaction.

With this foundational document, the app can now move into wireframing, database design, and implementation stages.

