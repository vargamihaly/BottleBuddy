# BottleBuddy End-to-End Test Plan

## 1. User Registration and Authentication

### Test Case 1.1: Successful User Registration
**Objective:** Verify that a new user can successfully register for an account.
**Steps:**
1.  Navigate to the registration page (`/auth`).
2.  Click the "Register" tab.
3.  Fill in the registration form with valid, unique credentials:
    *   **Email:** `test.user.[timestamp]@example.com`
    *   **Password:** `ValidPassword123!`
    *   **Confirm Password:** `ValidPassword123!`
    *   **Full Name:** `Test User`
    *   **Username:** `testuser[timestamp]`
4.  Click the "Register" button.
**Expected Result:**
*   The user is redirected to the homepage (`/`).
*   The user's full name ("Test User") is visible in the header, confirming they are logged in.

### Test Case 1.2: Successful User Login and Logout
**Objective:** Verify that a registered user can log in and out of the application.
**Prerequisites:** A user account must exist.
**Steps:**
1.  Navigate to the login page (`/auth`).
2.  Enter the email and password of the pre-existing user.
3.  Click the "Login" button.
**Expected Result:**
*   The user is redirected to the homepage (`/`).
*   The user's full name is visible in the header.
**Logout Steps:**
1.  Click on the user's name in the header to open the dropdown menu.
2.  Click the "Log out" button.
**Expected Result:**
*   The user is redirected to the login page (`/auth`).

---

## 2. Bottle Listing Management

### Test Case 2.1: Create a New Bottle Listing
**Objective:** Verify that a logged-in user can create a new bottle listing.
**Prerequisites:** User must be logged in.
**Steps:**
1.  Navigate to the "Create Listing" page.
2.  Fill out the listing form:
    *   **Number of Bottles:** `100`
    *   **Location:** Select a valid address from the map.
    *   **Title:** `Test Bottle Listing`
    *   **Description:** `This is a test listing.`
3.  Click the "Create Listing" button.
**Expected Result:**
*   The user is redirected to the "My Listings" page.
*   A success notification appears.

### Test Case 2.2: View and Verify Created Listing
**Objective:** Verify that the created listing appears correctly in the user's listings.
**Prerequisites:** User must have created a listing.
**Steps:**
1.  Navigate to the "My Listings" page.
2.  Verify that the newly created listing is displayed with the correct information (title, bottle count, status "Open").

### Test Case 2.3: Delete a Bottle Listing
**Objective:** Verify that a user can delete their own bottle listing.
**Prerequisites:** User must have an "Open" listing.
**Steps:**
1.  Navigate to the "My Listings" page.
2.  Find the listing created in the previous tests.
3.  Click the "Delete" button.
4.  Confirm the deletion in the confirmation dialog.
**Expected Result:**
*   The listing is removed from the "My Listings" page.
*   A success notification appears.

---

## 3. End-to-End Pickup Workflow

### Test Case 3.1: Volunteer Requests Pickup
**Objective:** Verify that a user can request to pick up another user's bottle listing.
**Prerequisites:**
*   User A (Owner) has created a bottle listing.
*   User B (Volunteer) is logged in.
**Steps:**
1.  As User B, find the bottle listing created by User A on the homepage.
2.  Click on the listing to view its details.
3.  Click the "Offer to Pick Up" button.
4.  Confirm the pickup request.
**Expected Result:**
*   A success notification appears.
*   The pickup request is visible in User B's "My Pickup Tasks" page with "Pending" status.

### Test Case 3.2: Listing Owner Accepts Pickup Request
**Objective:** Verify that the listing owner can accept a pickup request.
**Prerequisites:** User B has requested to pick up User A's listing.
**Steps:**
1.  Log in as User A (Owner).
2.  Navigate to the "My Listings" page.
3.  Find the relevant listing and view the incoming pickup requests.
4.  Click the "Accept" button on the request from User B.
**Expected Result:**
*   The listing's status changes to "Claimed".
*   User B's request status changes to "Accepted".
*   An in-app notification is sent to User B.

### Test Case 3.3: Pickup Completion
**Objective:** Verify that either party can mark the pickup as complete.
**Prerequisites:** A pickup request has been accepted.
**Steps:**
1.  Log in as either User A or User B.
2.  Navigate to the relevant listing/pickup task.
3.  Click the "Mark as Completed" button.
4.  Confirm the action.
**Expected Result:**
*   The listing's status changes to "Completed".
*   A transaction is automatically created.
*   An in-app notification is sent to the other user.

### Test Case 3.4: User Rating Exchange
**Objective:** Verify that both users can rate each other after a completed transaction.
**Prerequisites:** A pickup has been completed.
**Steps:**
1.  Log in as User A (Owner).
2.  Navigate to the completed transaction and click the "Rate" button.
3.  Select a star rating (e.g., 5 stars) and add a comment.
4.  Submit the rating for User B.
5.  Log out and log in as User B (Volunteer).
6.  Repeat steps 2-4 to rate User A.
**Expected Result:**
*   The ratings are submitted successfully.
*   The ratings are visible on each user's profile.

---

## 4. Real-time Messaging

### Test Case 4.1: Send and Receive Messages
**Objective:** Verify that users involved in a pickup can communicate via the messaging system.
**Prerequisites:** A pickup request has been made.
**Steps:**
1.  Log in as User A (Owner).
2.  Navigate to the "Messages" page and select the conversation with User B.
3.  Send a message (e.g., "When can you pick up the bottles?").
4.  Log out and log in as User B (Volunteer).
5.  Navigate to the "Messages" page.
**Expected Result:**
*   User B can see the message from User A in real-time.
*   An unread message indicator is visible.
**Reply Steps:**
1.  As User B, reply to the message (e.g., "I can be there at 5 PM.").
2.  Log out and log in as User A.
**Expected Result:**
*   User A can see the reply from User B in real-time.

---

## 5. Notifications

### Test Case 5.1: Verify In-App Notifications
**Objective:** Verify that users receive in-app notifications for key events.
**Prerequisites:** This test should be conducted throughout the pickup workflow.
**Events to Track:**
*   **New Pickup Request:** User A should receive a notification when User B requests a pickup.
*   **Request Accepted:** User B should receive a notification when User A accepts the request.
*   **Transaction Completed:** Both users should receive a notification when the pickup is marked as complete.
*   **New Rating:** Both users should receive a notification when they are rated by the other party.
**Steps:**
1.  At each key stage of the workflow, check the notification bell icon in the header.
2.  Click the bell to view the notification dropdown and verify the content.
3.  Navigate to the `/notifications` page to see the full history.
**Expected Result:**
*   Notifications for all key events are generated and displayed correctly.
*   The unread notification count is accurate.
