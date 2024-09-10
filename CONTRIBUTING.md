# Local Development

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/MatthewDavidJordan/devs-first-event-app.git
cd devs-first-event-app
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed. Then, run the following command to install project dependencies:

```bash
npm install
```

### 3. Run the Development Server

After installing the dependencies, start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 4. Environment Variables

Make sure to configure any necessary environment variables in a `.env.local` file.

```bash
NEXT_PUBLIC_SUPABASE_URL=<get-this-from-supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get-this-from-supabase>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=<get-from-resend>
```

Now you're ready to start developing!
