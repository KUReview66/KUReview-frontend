describe("Exercise Page – All Units", () => {
  const username = "b6410546246";
  const password = "Preme2804!";
  const baseUrl = "http://localhost:3001";

  const units = [
    { name: "Unit 02 - Basic", path: "exerciseU2" },
    { name: "Unit 03 - Subroutine", path: "exerciseU3" },
    { name: "Unit 05 - Selection", path: "exerciseU5" },
    { name: "Unit 06 - Repetition", path: "exerciseU6" },
    { name: "Unit 07 - List", path: "exerciseU7" },
    { name: "Unit 08 - File", path: "exerciseU8" },
    { name: "Unit 09 - Numpy", path: "exerciseU9" },
  ];

  beforeEach(() => {
    cy.visit(baseUrl);

    // Stub alert
    cy.window().then((win) => cy.stub(win, "alert").as("alertStub"));

    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", `/score/${username}`);
  });

  units.forEach((unit) => {
    it(`should open ${unit.name} successfully`, () => {
      cy.contains("Exercises").click();

      cy.contains(unit.name).click();

      cy.url({ timeout: 20000 }).should("include", `/${unit.path}/${username}`);

      // Wait for either loading spinner to disappear or question to appear
      cy.get(".MuiCircularProgress-root", { timeout: 30000 }).should(
        "not.exist"
      );

      // Assert the page shows a question or header
      cy.contains("Question", { timeout: 30000 }).should("exist");
      cy.contains("Unit:", { timeout: 30000 }).should("exist");
    });
  });
});
describe("Exercise Page – Unit 02 Behavior", () => {
  const username = "b6410546246";
  const password = "Preme2804!";
  const baseUrl = "http://localhost:3001";

  beforeEach(() => {
    cy.visit(baseUrl);

    cy.window().then((win) => cy.stub(win, "alert").as("alertStub"));

    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", `/score/${username}`);
    cy.contains("Exercises").click();
    cy.contains("Unit 02 - Basic").click();

    cy.url({ timeout: 10000 }).should("include", `/exerciseU2/${username}`);
    cy.get(".MuiCircularProgress-root", { timeout: 30000 }).should("not.exist");
    cy.contains("Question", { timeout: 30000 }).should("exist");
  });

  it("should show question and options", () => {
    cy.get(".MuiButtonBase-root").should("have.length.at.least", 2); // quiz options
    cy.contains("Question 1").should("exist");
  });

  it("should allow selecting an answer and move to next question", () => {
    cy.get(".MuiButtonBase-root").first().click();
    cy.wait(500); // wait for transition
    cy.contains("Question 2").should("exist");
  });

  it("should not allow navigation without answering", () => {
    cy.get(".MuiButtonBase-root").should("have.length.at.least", 2);
    cy.get(".MuiButtonBase-root").then((options) => {
      // Don't click anything, just wait
      cy.wait(1000);
      cy.contains("Question 1").should("exist"); // Still on question 1
    });
  });
});
describe("Exercise Page – Complete Quiz and Retry Flow", () => {
  const username = "b6410546246";
  const password = "Preme2804!";
  const baseUrl = "http://localhost:3001";

  beforeEach(() => {
    cy.visit(baseUrl);

    cy.window().then((win) => cy.stub(win, "alert").as("alertStub"));
    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", `/score/${username}`);
    cy.contains("Exercises").click();
    cy.contains("Unit 02 - Basic").click();

    cy.url({ timeout: 10000 }).should("include", `/exerciseU2/${username}`);
    cy.get(".MuiCircularProgress-root", { timeout: 30000 }).should("not.exist");
    cy.contains("Question", { timeout: 30000 }).should("exist");
  });

  it("should complete the quiz and see final score and suggestion box", () => {
    // Answer all 10 questions
    for (let i = 0; i < 10; i++) {
      cy.get(".MuiButtonBase-root", { timeout: 10000 }).first().click();
      cy.wait(500); // Wait for transition
    }

    // Score shown
    cy.contains("Your score:").should("exist");
    cy.contains("/ 100").should("exist");

    // Suggestion box
    cy.contains("What to Improve", { timeout: 20000 }).should("exist");
  });

  it("should redo the exercise using Redo button", () => {
    // Complete all questions first
    for (let i = 0; i < 10; i++) {
      cy.get(".MuiButtonBase-root", { timeout: 10000 }).first().click();
      cy.wait(500);
    }

    // Click Redo
    cy.contains("Redo Exercise").click();

    // Confirm quiz reset
    cy.get(".MuiCircularProgress-root", { timeout: 30000 }).should("not.exist");
    cy.contains("Question 1").should("exist");
    cy.contains("Your score:").should("not.exist");
  });
});
