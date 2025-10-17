# Ubetanation Landing Page

A modern, responsive company profile website built with Next.js 15, TypeScript, and TailwindCSS.

## Features

- 🚀 **Next.js 15** with App Router
- 💪 **TypeScript** for type safety  
- 🎨 **TailwindCSS** for styling
- 🧩 **shadcn/ui** component library
- 📱 **Responsive design** for all devices
- 🔍 **SEO optimized** with metadata API
- 🎭 **Modern animations** and 3D elements (coming soon)
- 🔐 **Admin dashboard** for content management (coming soon)
- 📊 **Analytics integration** (coming soon)

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: SQLite + Prisma ORM (coming soon)
- **Authentication**: Session-based auth with bcrypt (coming soon)
- **Animations**: Framer Motion + React Three Fiber (coming soon)
- **File Storage**: VPS file system with Sharp (coming soon)
- **Deployment**: VPS with Nginx + PM2 (coming soon)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ubetanation-landing-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local .env.local
   # Edit .env.local with your values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run clean` - Clean build artifacts

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── hooks/              # Custom React hooks
└── data/               # Static data files
```

## Development Workflow

This project uses **Task Master AI** for project management and task tracking. 

Key commands:
- `task-master list` - View all tasks
- `task-master next` - Get next task to work on
- `task-master show <id>` - View task details

## Contributing

1. Check the task list with `task-master list`
2. Pick up the next available task with `task-master next`
3. Mark task as in-progress: `task-master set-status --id=<id> --status=in-progress`
4. Complete the implementation
5. Mark task as done: `task-master set-status --id=<id> --status=done`

## License

Private project for Ubetanation company.