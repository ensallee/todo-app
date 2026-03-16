const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FILE_URL);
  });

  // --- Page Load ---
  test('shows correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('My To-Do List');
  });

  test('shows empty state message on load', async ({ page }) => {
    await expect(page.locator('.empty')).toHaveText('Add your first task above.');
  });

  // --- Adding Tasks ---
  test('adds a new task when add button is clicked', async ({ page }) => {
    await page.fill('#newTask', 'Buy groceries');
    await page.click('#addBtn');
    await expect(page.locator('.task-item')).toHaveCount(1);
    await expect(page.locator('.task-text').first()).toHaveText('Buy groceries');
  });

  test('adds a task when Enter key is pressed', async ({ page }) => {
    await page.fill('#newTask', 'Walk the dog');
    await page.press('#newTask', 'Enter');
    await expect(page.locator('.task-item')).toHaveCount(1);
  });

  test('clears input field after adding a task', async ({ page }) => {
    await page.fill('#newTask', 'Buy groceries');
    await page.click('#addBtn');
    await expect(page.locator('#newTask')).toHaveValue('');
  });

  test('does not add a task when input is empty', async ({ page }) => {
    await page.click('#addBtn');
    await expect(page.locator('.task-item')).toHaveCount(0);
  });

  test('adds multiple tasks', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 2');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 3');
    await page.click('#addBtn');
    await expect(page.locator('.task-item')).toHaveCount(3);
  });

  // --- Completing Tasks ---
  test('marks a task as done when checkbox is clicked', async ({ page }) => {
    await page.fill('#newTask', 'Buy groceries');
    await page.click('#addBtn');
    await page.click('.checkbox');
    await expect(page.locator('.task-item')).toHaveClass(/done/);
    await expect(page.locator('.checkbox')).toHaveClass(/checked/);
  });

  test('can uncheck a completed task', async ({ page }) => {
    await page.fill('#newTask', 'Buy groceries');
    await page.click('#addBtn');
    await page.click('.checkbox'); // check
    await page.click('.checkbox'); // uncheck
    await expect(page.locator('.task-item')).not.toHaveClass(/done/);
  });

  // --- Deleting Tasks ---
  test('deletes a task when delete button is clicked', async ({ page }) => {
    await page.fill('#newTask', 'Buy groceries');
    await page.click('#addBtn');
    await page.click('.icon-btn.delete');
    await expect(page.locator('.task-item')).toHaveCount(0);
  });

  test('shows empty state after all tasks are deleted', async ({ page }) => {
    await page.fill('#newTask', 'Buy groceries');
    await page.click('#addBtn');
    await page.click('.icon-btn.delete');
    await expect(page.locator('.empty')).toBeVisible();
  });

  // --- Filtering ---
  test('filter: Active shows only incomplete tasks', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 2');
    await page.click('#addBtn');
    await page.locator('.task-item').first().locator('.checkbox').click();
    await page.click('[data-filter="active"]');
    await expect(page.locator('.task-item')).toHaveCount(1);
  });

  test('filter: Done shows only completed tasks', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 2');
    await page.click('#addBtn');
    await page.locator('.task-item').first().locator('.checkbox').click();
    await page.click('[data-filter="done"]');
    await expect(page.locator('.task-item')).toHaveCount(1);
  });

  test('filter: All shows every task', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 2');
    await page.click('#addBtn');
    await page.locator('.task-item').first().locator('.checkbox').click();
    await page.click('[data-filter="all"]');
    await expect(page.locator('.task-item')).toHaveCount(2);
  });

  // --- Task Count ---
  test('task count shows correct number of remaining tasks', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 2');
    await page.click('#addBtn');
    await expect(page.locator('#taskCount')).toHaveText('2 tasks remaining');
  });

  test('task count uses singular when only one task remains', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await expect(page.locator('#taskCount')).toHaveText('1 task remaining');
  });

  test('task count decreases when a task is marked done', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 2');
    await page.click('#addBtn');
    await page.locator('.task-item').first().locator('.checkbox').click();
    await expect(page.locator('#taskCount')).toHaveText('1 task remaining');
  });

  // --- Clear Completed ---
  test('Clear completed removes all done tasks', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await page.fill('#newTask', 'Task 2');
    await page.click('#addBtn');
    await page.locator('.task-item').first().locator('.checkbox').click();
    await page.click('#clearDone');
    await expect(page.locator('.task-item')).toHaveCount(1);
  });

  test('Clear completed button is hidden when no tasks are done', async ({ page }) => {
    await page.fill('#newTask', 'Task 1');
    await page.click('#addBtn');
    await expect(page.locator('#clearDone')).toBeHidden();
  });
});
