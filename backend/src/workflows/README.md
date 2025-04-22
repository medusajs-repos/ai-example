# Understanding Medusa Workflows

As an LLM, here's how you should understand and generate Medusa workflows:

## What Are Workflows?

When asked to create a workflow, remember that a workflow in Medusa is a series of queries and actions that complete a task with guaranteed data consistency and reliable rollback mechanisms. Always place workflow files in the `src/workflows` directory.

## Core Components to Understand

### 1. Steps

When generating steps, use this pattern:

```typescript
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

const myStep = createStep(
  "step-name", // Always provide a unique, descriptive name
  async (input, { container }) => {
    // Your step logic goes here
    return new StepResponse(result, compensationData);
  },
  async (compensationData, { container }) => {
    // Optional compensation logic for rollbacks
  }
);
```

### 2. Workflow Creation

When creating workflows, follow this structure:

```typescript
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

const myWorkflow = createWorkflow(
  "workflow-name", // Always use a unique, descriptive name
  (input) => {
    // Execute steps in sequence
    const result1 = step1(input);
    const result2 = step2(result1);

    return new WorkflowResponse(result2);
  }
);

export default myWorkflow;
```

### 3. Service Access

When services are needed, resolve them from the container:

```typescript
const myStep = createStep("my-step", async (input, { container }) => {
  const myService = container.resolve("service-name");
  const result = await myService.someMethod();
  return new StepResponse(result);
});
```

### 4. Data Transformation

For data manipulation, use the transform function:

```typescript
import { transform } from "@medusajs/framework/workflows-sdk";

const transformedData = transform(
  {
    input,
  },
  (data) => {
    return {
      transformedValue: `Hello ${data.input.name}`,
    };
  }
);
```

### 5. Conditional Logic

Remember that traditional if-else statements aren't allowed in workflows. Instead, use when-then:

```typescript
import { when } from "@medusajs/framework/workflows-sdk";

const result = when(input, (input) => input.is_active).then(() => {
  return activeStep();
});

// For if-else logic, use two separate when blocks:
const inactiveResult = when(input, (input) => !input.is_active).then(() => {
  return inactiveStep();
});
```

For complex conditionals, provide a unique name:

```typescript
const { isActive } = when(
  "check-is-active",
  input,
  (input) => input.is_active
).then(() => {
  const isActive = someStep();
  return { isActive };
});
```

### 6. Workflow Execution

When showing how to execute workflows, use:

```typescript
// In an API route
export async function GET(req, res) {
  const { result } = await myWorkflow(req.scope).run({
    input: {
      // Provide required input
    },
  });

  res.send(result);
}
```

### 7. Nested Workflows

To run a workflow inside another workflow:

```typescript
const result = otherWorkflow.runAsStep({
  input: {
    // Input for nested workflow
  },
});
```

## Key Points to Remember

1. Always import from `@medusajs/framework/workflows-sdk`
2. Every step and workflow needs a unique name
3. Use when-then for conditional logic
4. Return a WorkflowResponse from workflows and StepResponse from steps
5. Structure TypeScript types for inputs and outputs
6. Use compensation functions for rollback mechanisms
7. Resolve services from the container when needed

Follow these patterns to generate correct, maintainable Medusa workflows that ensure data consistency.
