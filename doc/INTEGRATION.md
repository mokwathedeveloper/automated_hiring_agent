
# WhatsApp Integration

This document describes the implementation of the WhatsApp integration feature in the dashboard.

## Feature Overview

The WhatsApp integration feature allows users to send WhatsApp messages to candidates directly from the dashboard. This feature is implemented by adding a "WhatsApp" button to the candidate cards and table rows. Clicking this button opens a modal where the user can type and send a message to the candidate's phone number.

## Implementation Details

### Frontend

- **`src/components/Dashboard.tsx`**: This file was modified to include the "WhatsApp" button in the `CandidateCard` and `TableRow` components. It also includes the state management for the WhatsApp modal.
- **`src/components/WhatsAppModal.tsx`**: This new component renders a modal with a form to send a WhatsApp message. The form includes a textarea for the message and a "Send" button. When the user clicks the "Send" button, it makes a POST request to the `/api/whatsapp` endpoint.

### Backend

- **`src/app/api/whatsapp/route.ts`**: This existing file handles the backend logic for sending WhatsApp messages using the Twilio API. The frontend sends a POST request to this endpoint with the recipient's phone number and the message.

## How to Use

1.  Navigate to the dashboard.
2.  Click the "WhatsApp" button on any candidate card or row.
3.  A modal will open with the candidate's name.
4.  Type your message in the textarea.
5.  Click the "Send" button to send the message.
