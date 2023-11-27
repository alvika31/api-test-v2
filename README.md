## api-test-medusa
Notes: Before using this automated testing, please create an admin account, then login to the admin dashboard and fill in the region and product sections.
to create a user admin has been documented at https://github.com/alvika31/my-medusa-store-v2
1. Open any terminal and type the command: git clone https://github.com/alvika31/api-test-v2.git
2. When finished, type the command: npm install
3. after that in the ./tests/api-test.spec.js section adjust the id to the database, then type the command: npx playwright install
4. then type the command: npx playwright test --ui
5. and run in the playwright ui
