# UI-UX-Task-Integration

**AgentForm Frontend Project** – A fully functional agent creation form built with React, TypeScript, and modern UI components.

---

## Project Overview

This project implements a dynamic **AgentForm** with complete functionality for creating, editing, and testing AI agents. The form includes:

- Basic agent information
- Call settings
- Language, Voice, Prompt, and Model selection
- Call Script & Service/Product Description
- File uploads with drag-and-drop
- Test call feature
- Tool toggles (Hang up, Callback, Live transfer)

All features include **loading states, error handling, validation, and UI/UX improvements**.

---

## Features Implemented

### 1. **Form Fields**
- **Agent Name & Description**
- **Call Type** (Inbound / Outbound)
- **Language, Voice, Prompt, Model** dropdowns
- **Latency & Speed sliders**
- **Call Script** textarea with character limit
- **Service/Product Description** textarea with character limit

### 2. **Dropdowns**
- Dynamically fetched from API (`languages`, `voices`, `prompts`, `models`)
- Loading state handled with disabled placeholder
- Error handling using `react-hot-toast`

### 3. **File Upload / Reference Data**
- Drag-and-drop and browse files
- Accepted types: `.pdf`, `.doc`, `.docx`, `.txt`, `.csv`, `.xlsx`, `.xls`
- Upload to server via signed URL
- Error handling & success notifications
- Remove uploaded files dynamically

### 4. **Test Call**
- Input for first name, last name, gender, phone number
- Validates required fields
- Saves agent automatically if not saved
- Sends request to `/test-call` endpoint
- User feedback via toast notifications

### 5. **Form Validation**
- Required fields checked before save
- Shows toast notifications for missing fields

### 6. **Unsaved Changes Warning**
- Alerts user if leaving page with unsaved changes

### 7. **UI/UX Enhancements**
- Collapsible sections for organized layout
- Sticky bottom save bar
- Real-time updates for sliders and textareas
- Badges showing missing required fields
- Clear visual feedback for drag-and-drop upload area

---

## Tech Stack

- **React 18 / Next.js 16**
- **TypeScript**
- **React Hooks** (`useState`, `useEffect`, `useCallback`, `useRef`)
- **Radix UI / Lucide React** for components
- **React Hot Toast** for notifications
- **Fetch API** for backend communication
- **Tailwind CSS** for styling

---

## How to Run

1. Clone the repo:

```bash

git clone https://github.com/AmirAboshama/UI-UX-Task-Integration.git

cd UI-UX-Task-Integration

Install dependencies:



npm install

Set environment variables in .env:



NEXT\_PUBLIC\_API\_BASE\_URL=http://localhost:3001/api

Run the development server:



npm run dev

Open in browser:



http://localhost:3000





Notes

All API requests include error handling with toast.error



Loading states for dropdowns ensure smooth user experience



Form cannot be submitted if required fields are missing



Test call feature ensures that agent can be previewed before deployment



Files uploaded are tracked in state and can be removed dynamically







Author



Amir Aboshama – Frontend Developer

GitHub: [AmirAboshama]
