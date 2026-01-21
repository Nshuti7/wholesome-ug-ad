# Wholesome Uganda Admin

A modern admin dashboard for managing Wholesome Uganda operations, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🎯 Overview

This admin panel manages content and operations for Wholesome Uganda. It integrates with the Wholesome Uganda NestJS backend to manage:

- **Blog Posts** - Content management and publishing
- **Gallery** - Image and media management with Cloudinary
- **Services** - Service offerings management
- **Contact Submissions** - Contact form submissions
- **Newsletter** - Newsletter subscriber management

## 🚀 Features

### Blog Management
- Create and manage blog posts with rich content
- Image uploads via Cloudinary
- Category management
- Published/unpublished status
- SEO-friendly content

### Gallery Management
- Upload and manage images with Cloudinary
- Organize by folders and context
- Image metadata and descriptions
- Bulk operations

### Services Management
- Create and manage service offerings
- Image uploads for services
- Published/unpublished status
- Service descriptions and details

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **State Management**: React Hooks, custom hooks
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React, Tabler Icons
- **Backend Integration**: RESTful API with fetch

## 📁 Project Structure

```
admin/
├── app/                    # Next.js app directory
│   ├── api/               # API routes for backend integration
│   ├── blog/              # Blog management
│   ├── gallery/           # Gallery management
│   ├── services/          # Services management
│   ├── contact/           # Contact submissions
│   ├── newsletter/        # Newsletter management
│   ├── profile/           # User profile
│   └── settings/          # Settings
├── components/            # Reusable UI components
│   ├── gallery/          # Gallery-specific components
│   ├── ui/               # Base UI components
│   └── layouts/          # Layout components
├── lib/                  # Type definitions and schemas
│   ├── blogs/            # Blog types and validation
│   ├── gallery/          # Gallery types
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
└── services/             # API service functions
```

## 🔧 Setup and Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 🔌 Backend Integration

The admin panel connects to the Wholesome Uganda NestJS backend via RESTful APIs:

- **Blog**: `/api/blog` - CRUD operations for blog posts
- **Gallery**: `/api/gallery` - Media content management with Cloudinary
- **Services**: `/api/services` - Service offerings management
- **Contact**: `/api/contact` - Contact form submissions
- **Newsletter**: `/api/newsletter` - Newsletter subscriber management
- **Auth**: `/api/auth` - Authentication (login, register, profile, etc.)

## 🎨 UI Components

### Form Components
- `ReusableForm` - Flexible form component with validation
- `FormDialog` - Modal forms for create/edit operations
- Custom form fields for radio-specific data

### Data Display
- `DataTable` - Sortable and filterable data tables
- `Card` components for statistics and information
- Responsive grid layouts

### Navigation
- Collapsible sidebar with radio station branding
- Breadcrumb navigation
- User profile and settings

## 📊 Dashboard Features

- **Overview Statistics** - Blog posts, gallery items, services, contacts, newsletter subscribers
- **Content Distribution** - Content categories and status
- **Health Status** - System monitoring and alerts
- **Recent Activity** - Latest changes and updates

## 🔐 Authentication

- JWT-based authentication
- Role-based access control
- Session management
- Secure API endpoints

## 🚀 Development

### Adding New Features
1. Create types in `lib/[feature]/types.ts`
2. Add validation schemas in `lib/[feature]/schema.ts`
3. Create components in `components/[feature]/`
4. Add API routes in `app/api/[feature]/`
5. Update navigation in `components/app-sidebar.tsx`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the established color scheme
- Maintain consistent spacing and typography
- Ensure responsive design for all screen sizes

## 📝 Notes

- The admin panel has been refactored for Wholesome Uganda
- Removed unnecessary features (programs, advertising, team, reviews, logos)
- Focused on essential content management: Blog, Gallery, Services, Contact, Newsletter
- The backend integration is designed to work with the Wholesome Uganda NestJS API
- The UI follows modern design principles with a focus on usability

## 🤝 Contributing

1. Follow the established code structure
2. Use TypeScript for all new code
3. Add proper validation with Zod schemas
4. Ensure responsive design
5. Test with the backend API

## 📄 License

This project is part of the Wholesome Uganda platform.
