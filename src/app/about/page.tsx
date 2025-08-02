import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Weblog',
  description: 'Learn more about me and this blog. I\'m a passionate developer who loves sharing knowledge about web development, technology, and more.',
  keywords: ['about', 'developer', 'web development', 'technology', 'blog'],
  authors: [{ name: 'Admin' }],
  creator: 'Admin',
  robots: 'index, follow',
  openGraph: {
    title: 'About | Weblog',
    description: 'Learn more about me and this blog. I\'m a passionate developer who loves sharing knowledge about web development, technology, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Weblog',
    description: 'Learn more about me and this blog. I\'m a passionate developer who loves sharing knowledge about web development, technology, and more.',
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to my corner of the internet! Here's a bit about who I am and what this blog is all about.
          </p>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            Hi there! 👋 I'm a developer who loves building things for the web. 
            This little corner of the internet is where I share my thoughts, 
            experiments, and learnings about technology and life.
          </p>

          <p>
            I started this blog as a way to document my journey and connect with 
            like-minded people. You'll find posts about web development, new technologies 
            I'm exploring, and occasionally some non-tech musings.
          </p>

          <h2>What I'm Working On</h2>
          <p>
            Currently, I'm focused on modern web technologies - mainly React, TypeScript, 
            and various frameworks that make building for the web more enjoyable. I love 
            experimenting with new tools and sharing what I learn along the way.
          </p>

          <h2>Beyond Code</h2>
          <p>
            When I'm not coding, I enjoy reading, exploring new places, and always 
            learning something new. I believe the best ideas often come from outside 
            our usual domains.
          </p>

          <h2>Let's Connect</h2>
          <p>
            Feel free to reach out if you want to chat about anything you've read here, 
            collaborate on something interesting, or just say hi. I'm always excited 
            to meet new people and hear different perspectives.
          </p>

          <div className="mt-12 p-6 bg-secondary rounded-lg">
            <p className="mb-0 text-center italic">
              "The best way to learn is to teach, and the best way to teach is to keep learning."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}