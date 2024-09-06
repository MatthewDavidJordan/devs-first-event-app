### Task: Design an Email Verification API and Database Update

#### **1. Database Changes:**

- **Modify the existing `emails` table**:
  - Add a new column `nonce`: This will hold a unique value (nonce) used to verify the email address.
  - Add a new column `confirmed`: This will store a boolean (or integer) value to indicate whether the email is verified. Initially, it will be set to `0` (not verified), and once verified, it will be updated to `1` (verified).

#### **2. API Workflow:**

- **Email Submission Flow**:

  1.  When a user submits their **NetID** via the existing API:
      - **Check for the '@' symbol**:
        - If the **NetID** already contains '@', treat it as a valid email address.
        - If **NetID** does not contain '@', append `@georgetown.edu` to form a valid email.
  2.  **Generate a unique nonce** for the email verification process.
  3.  Insert the following into the `emails` table:
      - The **NetID** (as an email).
      - The **team_id** (already part of the logic).
      - The **nonce** for email verification.
      - The **confirmed** status, set to `0` by default.

- **Send Verification Email**:
  - After successfully inserting the email into the database:
    - Send an email to the user’s email address with:
      - The **NetID** (email address).
      - The **nonce** (unique code).
    - The email will contain a link or verification token the user can click to confirm their email.

#### **3. Email Verification Endpoint:**

- **API Endpoint for Verification**:
  1.  The API should receive the **NetID** (email) and the **nonce** when the user clicks the verification link in the email.
  2.  The API will then:
      - Look up the **NetID** in the database.
      - Match the **nonce** to the one stored in the database.
      - If the **nonce** matches and the email exists, update the `confirmed` field to `1`, indicating that the email has been verified.

#### **4. Error Handling and Validation:**

- Ensure that the **nonce** has a time limit or expiration for security (optional, but recommended).
- Provide appropriate error responses if:
  - The email or **nonce** is invalid.
  - The **NetID** is already verified.

#### **Summary of Steps:**

1. **Database Modification**:
   - Add `nonce` and `confirmed` columns to the `emails` table.
2. **Email Submission**:
   - Receive **NetID**.
   - Check for the '@' symbol and adjust the **NetID** if necessary.
   - Insert **NetID**, **team_id**, **nonce**, and `confirmed = 0` into the database.
3. **Email Sending**:
   - Send a verification email containing the **NetID** and **nonce** to the user.
4. **Verification API**:
   - Verify the **NetID** and **nonce** received from the email.
   - Update the `confirmed` status to `1` once verified.

With this structure, you will have a fully functional email verification system integrated with your existing Next.js and Supabase setup. Let me know if you'd like to proceed further or need any adjustments!
