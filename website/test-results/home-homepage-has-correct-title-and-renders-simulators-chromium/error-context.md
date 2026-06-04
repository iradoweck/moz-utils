# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> homepage has correct title and renders simulators
- Location: tests\e2e\home.spec.ts:3:1

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /moz-utils/i
Received string:  "Zedeck's Training"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    11 × unexpected value "Zedeck's Training"

```

```yaml
- navigation:
  - img "Zedeck's Training"
  - link "Zedeck's Training":
    - /url: /
  - link "Home":
    - /url: /
  - link "Courses":
    - /url: /courses
  - link "About":
    - /url: /about
  - link "Contact":
    - /url: /contact
  - button "EN"
  - 'button "Theme: System"'
  - link "Login":
    - /url: /login
  - link "Get Started":
    - /url: /register
    - button "Get Started"
- main:
  - text: E m p o w e r Y o u r C a r e e r w i t h E x c e l l e n c e .
  - paragraph:
    - text: The
    - strong: ZEDECK'S TRAINING
    - text: is ZEDECK'S IT's elite educational platform. We offer high-level technical training, connecting advanced theory to the practice required by the global market.
  - link "Start Journey":
    - /url: /register
    - button "Start Journey"
  - link "Explore Courses":
    - /url: /courses
    - button "Explore Courses"
  - heading "Who We Are" [level=2]
  - paragraph:
    - text: Founded in 2025 as the educational arm of
    - strong: ZEDECK'S IT
    - text: ", ZTS was born to bridge the gap for high-performance technological talents."
  - paragraph:
    - text: Our mission is to
    - strong: forge complete professionals
    - text: through an immersive methodology. We believe technical education should be a direct catalyst for innovation and employability.
  - heading "Technology" [level=3]
  - paragraph: Programming, Web Design, Advanced Computing.
  - heading "Business" [level=3]
  - paragraph: Accounting, Management, Marketing, Secretarial.
  - heading "Communication" [level=3]
  - paragraph: Professional English, Organizational Communication.
  - heading "Networking" [level=3]
  - paragraph: Direct connection with the ZEDECK'S IT ecosystem.
  - heading "Why choose Zedeck's Training?" [level=2]
  - heading "Practice over Theory" [level=3]
  - paragraph: Courses developed with a focus on execution and real projects.
  - heading "Market Connection" [level=3]
  - paragraph: Internship opportunities and integration into ZEDECK'S IT projects.
  - heading "Hybrid Training" [level=3]
  - paragraph: Flexibility with in-person, online, and hybrid modalities.
  - text: Start your journey today
  - heading "Ready to transform your future?" [level=2]
  - paragraph: Join hundreds of students already building successful careers with Zedeck's Training.
  - link "Enroll Now":
    - /url: /register
    - button "Enroll Now"
  - link "View Available Courses":
    - /url: /courses
    - button "View Available Courses"
- contentinfo:
  - text: Zedeck's Training
  - paragraph: Empowering the next generation of professionals with world-class education and practical training.
  - heading "Platform" [level=4]
  - list:
    - listitem:
      - link "All Courses":
        - /url: /courses
    - listitem:
      - link "Pricing":
        - /url: /pricing
    - listitem:
      - link "For Trainers":
        - /url: /instructors
  - heading "Support" [level=4]
  - list:
    - listitem:
      - link "Help Center":
        - /url: /help
    - listitem:
      - link "Contact Us":
        - /url: /contact
    - listitem:
      - link "Terms of Service":
        - /url: /terms
  - heading "Newsletter" [level=4]
  - paragraph: Subscribe for updates.
  - textbox "Email address":
    - /placeholder: Email
  - button "Join"
  - paragraph:
    - text: © 2025-2026 Zedeck's Training | All Rights Reserved | Powered by
    - link "ZEDECK'S IT":
      - /url: https://zedecks.com
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('homepage has correct title and renders simulators', async ({ page }) => {
  4  |   await page.goto('/');
  5  | 
  6  |   // Check the title of the website
> 7  |   await expect(page).toHaveTitle(/moz-utils/i);
     |                      ^ Error: expect(page).toHaveTitle(expected) failed
  8  | 
  9  |   // Check that the main hero heading is visible
  10 |   const heading = page.locator('h1').filter({ hasText: /moz-utils/i });
  11 |   await expect(heading).toBeVisible();
  12 | 
  13 |   // Make sure the simulator loads by checking for the input field with placeholder "..."
  14 |   await expect(page.getByPlaceholder('...').first()).toBeVisible();
  15 | });
  16 | 
```