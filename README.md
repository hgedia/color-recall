# Static Site with Next.js

This is a static site built with Next.js and deployed to GitHub Pages. It uses GitHub Actions for automatic deployment.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. To set up deployment:

1. Go to your repository settings
2. Navigate to "Pages" under "Code and automation"
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Push changes to the main branch to trigger deployment

## Built With

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [GitHub Actions](https://github.com/features/actions) - For CI/CD
- [GitHub Pages](https://pages.github.com/) - For hosting

## Development

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
