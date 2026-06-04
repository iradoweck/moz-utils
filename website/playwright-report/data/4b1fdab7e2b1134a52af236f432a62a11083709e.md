# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: simulator.spec.ts >> Unified Simulator >> validates BI correctly
- Location: tests\e2e\simulator.spec.ts:25:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder('...')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img "Zedeck's Training" [ref=e8]
        - link "Zedeck's Training" [ref=e9] [cursor=pointer]:
          - /url: /
      - generic [ref=e10]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: /
        - link "Courses" [ref=e12] [cursor=pointer]:
          - /url: /courses
        - link "About" [ref=e13] [cursor=pointer]:
          - /url: /about
        - link "Contact" [ref=e14] [cursor=pointer]:
          - /url: /contact
      - generic [ref=e15]:
        - generic [ref=e16]:
          - button "EN" [ref=e17]:
            - generic [ref=e19]: EN
          - 'button "Theme: System" [ref=e20]':
            - img [ref=e21]
        - generic [ref=e23]:
          - link "Login" [ref=e24] [cursor=pointer]:
            - /url: /login
          - link "Get Started" [ref=e25] [cursor=pointer]:
            - /url: /register
            - button "Get Started" [ref=e26]
  - main [ref=e27]:
    - generic [ref=e30]:
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]: E
          - generic [ref=e36]: m
          - generic [ref=e37]: p
          - generic [ref=e38]: o
          - generic [ref=e39]: w
          - generic [ref=e40]: e
          - generic [ref=e41]: r
        - generic [ref=e42]:
          - generic [ref=e43]: "Y"
          - generic [ref=e44]: o
          - generic [ref=e45]: u
          - generic [ref=e46]: r
        - generic [ref=e47]:
          - generic [ref=e48]: C
          - generic [ref=e49]: a
          - generic [ref=e50]: r
          - generic [ref=e51]: e
          - generic [ref=e52]: e
          - generic [ref=e53]: r
        - generic [ref=e54]:
          - generic [ref=e55]: w
          - generic [ref=e56]: i
          - generic [ref=e57]: t
          - generic [ref=e58]: h
        - generic [ref=e59]:
          - generic [ref=e60]: E
          - generic [ref=e61]: x
          - generic [ref=e62]: c
          - generic [ref=e63]: e
          - generic [ref=e64]: l
          - generic [ref=e65]: l
          - generic [ref=e66]: e
          - generic [ref=e67]: "n"
          - generic [ref=e68]: c
          - generic [ref=e69]: e
          - generic [ref=e70]: .
      - paragraph [ref=e72]:
        - text: The
        - strong [ref=e73]: ZEDECK'S TRAINING
        - text: is ZEDECK'S IT's elite educational platform. We offer high-level technical training, connecting advanced theory to the practice required by the global market.
      - generic [ref=e74]:
        - link "Start Journey" [ref=e75] [cursor=pointer]:
          - /url: /register
          - button "Start Journey" [ref=e76]
        - link "Explore Courses" [ref=e77] [cursor=pointer]:
          - /url: /courses
          - button "Explore Courses" [ref=e78]
    - generic [ref=e81]:
      - generic [ref=e82]:
        - heading "Who We Are" [level=2] [ref=e83]
        - generic [ref=e84]:
          - paragraph [ref=e85]:
            - text: Founded in 2025 as the educational arm of
            - strong [ref=e86]: ZEDECK'S IT
            - text: ", ZTS was born to bridge the gap for high-performance technological talents."
          - paragraph [ref=e87]:
            - text: Our mission is to
            - strong [ref=e88]: forge complete professionals
            - text: through an immersive methodology. We believe technical education should be a direct catalyst for innovation and employability.
      - generic [ref=e89]:
        - generic [ref=e90]:
          - img [ref=e91]
          - heading "Technology" [level=3] [ref=e94]
          - paragraph [ref=e95]: Programming, Web Design, Advanced Computing.
        - generic [ref=e96]:
          - img [ref=e97]
          - heading "Business" [level=3] [ref=e101]
          - paragraph [ref=e102]: Accounting, Management, Marketing, Secretarial.
        - generic [ref=e103]:
          - img [ref=e104]
          - heading "Communication" [level=3] [ref=e107]
          - paragraph [ref=e108]: Professional English, Organizational Communication.
        - generic [ref=e109]:
          - img [ref=e110]
          - heading "Networking" [level=3] [ref=e115]
          - paragraph [ref=e116]: Direct connection with the ZEDECK'S IT ecosystem.
    - generic [ref=e118]:
      - heading "Why choose Zedeck's Training?" [level=2] [ref=e119]
      - generic [ref=e120]:
        - generic [ref=e121]:
          - img [ref=e123]
          - heading "Practice over Theory" [level=3] [ref=e125]
          - paragraph [ref=e126]: Courses developed with a focus on execution and real projects.
        - generic [ref=e127]:
          - img [ref=e129]
          - heading "Market Connection" [level=3] [ref=e132]
          - paragraph [ref=e133]: Internship opportunities and integration into ZEDECK'S IT projects.
        - generic [ref=e134]:
          - img [ref=e136]
          - heading "Hybrid Training" [level=3] [ref=e139]
          - paragraph [ref=e140]: Flexibility with in-person, online, and hybrid modalities.
    - generic [ref=e145]:
      - generic [ref=e146]:
        - img [ref=e147]
        - generic [ref=e150]: Start your journey today
      - heading "Ready to transform your future?" [level=2] [ref=e151]:
        - text: Ready to transform
        - text: your future?
      - paragraph [ref=e152]: Join hundreds of students already building successful careers with Zedeck's Training.
      - generic [ref=e153]:
        - link "Enroll Now" [ref=e154] [cursor=pointer]:
          - /url: /register
          - button "Enroll Now" [ref=e155]:
            - text: Enroll Now
            - img [ref=e156]
        - link "View Available Courses" [ref=e158] [cursor=pointer]:
          - /url: /courses
          - button "View Available Courses" [ref=e159]
  - contentinfo [ref=e160]:
    - generic [ref=e161]:
      - generic [ref=e162]:
        - generic [ref=e163]:
          - img [ref=e165]
          - generic [ref=e167]: Zedeck's Training
        - paragraph [ref=e168]: Empowering the next generation of professionals with world-class education and practical training.
      - generic [ref=e169]:
        - heading "Platform" [level=4] [ref=e170]
        - list [ref=e171]:
          - listitem [ref=e172]:
            - link "All Courses" [ref=e173] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e174]:
            - link "Pricing" [ref=e175] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e176]:
            - link "For Trainers" [ref=e177] [cursor=pointer]:
              - /url: /instructors
      - generic [ref=e178]:
        - heading "Support" [level=4] [ref=e179]
        - list [ref=e180]:
          - listitem [ref=e181]:
            - link "Help Center" [ref=e182] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e183]:
            - link "Contact Us" [ref=e184] [cursor=pointer]:
              - /url: /contact
          - listitem [ref=e185]:
            - link "Terms of Service" [ref=e186] [cursor=pointer]:
              - /url: /terms
      - generic [ref=e187]:
        - heading "Newsletter" [level=4] [ref=e188]
        - paragraph [ref=e189]: Subscribe for updates.
        - generic [ref=e190]:
          - textbox "Email address" [ref=e191]:
            - /placeholder: Email
          - button "Join" [ref=e192]
    - paragraph [ref=e194]:
      - text: © 2025-2026 Zedeck's Training | All Rights Reserved | Powered by
      - link "ZEDECK'S IT" [ref=e195] [cursor=pointer]:
        - /url: https://zedecks.com
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Unified Simulator', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('validates NUIT correctly', async ({ page }) => {
  9  |     // Select NUIT in the document type dropdown (assuming it's a select or similar)
  10 |     // Wait, let's just type a NUIT in the input
  11 |     const input = page.getByPlaceholder('...');
  12 |     await input.fill('400000008'); // Old modulo 11 valid nuit
  13 | 
  14 |     // The simulator might show invalid or valid based on the new weights.
  15 |     // The new weights for 40000000 is 1. Wait, let's use a known valid one for the NEW algorithm!
  16 |     // '100000000' is invalid.
  17 |     // Let's type '401626638' which the user said is valid!
  18 |     await input.fill('401626638');
  19 |     
  20 |     // Wait for the result to appear
  21 |     await expect(page.locator('text=Válido')).toBeVisible();
  22 |     await expect(page.locator('text=Colectiva')).toBeVisible(); // Or whatever it shows for 4...
  23 |   });
  24 | 
  25 |   test('validates BI correctly', async ({ page }) => {
  26 |     const input = page.getByPlaceholder('...');
> 27 |     await input.fill('110101234567A');
     |                 ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  28 |     
  29 |     // BI valid
  30 |     await expect(page.locator('text=Válido')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('validates Phone number correctly', async ({ page }) => {
  34 |     const input = page.getByPlaceholder('...');
  35 |     await input.fill('841234567');
  36 |     
  37 |     await expect(page.locator('text=Vodacom')).toBeVisible();
  38 |   });
  39 | 
  40 |   test('formats Currency correctly', async ({ page }) => {
  41 |     const input = page.getByPlaceholder('...');
  42 |     await input.fill('1500');
  43 |     // Assuming the simulator formats and shows "1 500,00 MT"
  44 |     await expect(page.locator('text=1 500,00 MT')).toBeVisible();
  45 |   });
  46 | });
  47 | 
```