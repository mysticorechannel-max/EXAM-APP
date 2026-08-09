# Bugfix Requirements Document

## Introduction

The quiz/exam page answer options display square checkbox-style selectors with a checkmark icon instead of circular radio button-style selectors as specified in the Figma design. This creates a visual inconsistency between the implemented UI and the design specification, and also implies multi-select behavior (checkboxes) when the quiz only allows single-answer selection (radio buttons).

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN an answer option is unselected THEN the system displays a square indicator with `rounded border-2 border-gray-300` styling (sharp-cornered checkbox appearance)

1.2 WHEN an answer option is selected THEN the system displays a filled blue square (`rounded border-2 border-[#155DFC] bg-[#155DFC]`) with a checkmark SVG icon inside

1.3 WHEN an answer option is selected THEN the system renders a checkmark path SVG (`M5 13l4 4L19 7`) as the selection indicator, which is a checkbox pattern rather than a radio button pattern

### Expected Behavior (Correct)

2.1 WHEN an answer option is unselected THEN the system SHALL display a circular indicator with `rounded-full` styling and a gray border (radio button appearance)

2.2 WHEN an answer option is selected THEN the system SHALL display a filled blue circle (`rounded-full border-[#155DFC] bg-[#155DFC]`) with a smaller white inner dot/circle as the selection indicator

2.3 WHEN an answer option is selected THEN the system SHALL render a small white inner circle (not a checkmark SVG) as the radio button selection indicator, matching the standard radio button pattern shown in the Figma design

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an answer option is clicked THEN the system SHALL CONTINUE TO select that answer and store it in state via `handleSelectAnswer`

3.2 WHEN an answer option is selected THEN the system SHALL CONTINUE TO apply the `bg-blue-50` highlight background to the entire row

3.3 WHEN an answer option is selected THEN the system SHALL CONTINUE TO display the answer text in blue (`text-[#155DFC]`) with medium font weight

3.4 WHEN an unselected answer option is hovered THEN the system SHALL CONTINUE TO show the `hover:bg-gray-50` background transition

3.5 WHEN navigating between questions THEN the system SHALL CONTINUE TO preserve previously selected answers and display the correct selected state

---

## Bug Condition (Formal)

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type AnswerOptionRenderState
  OUTPUT: boolean
  
  // The bug manifests in all answer option rendering - both selected and unselected
  // states use incorrect indicator shape (square instead of circle)
  RETURN X.isAnswerOptionRendered = true
END FUNCTION
```

```pascal
// Property: Fix Checking - Radio Button Appearance
FOR ALL X WHERE isBugCondition(X) DO
  rendered ← renderAnswerOption'(X)
  ASSERT rendered.indicator.shape = "circle" (rounded-full)
  ASSERT IF X.isSelected THEN rendered.indicator.innerContent = "white-dot" (not checkmark SVG)
END FOR
```

```pascal
// Property: Preservation Checking - Selection Behavior Unchanged
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT F(X) = F'(X)
END FOR
```

Note: Since the bug condition covers all answer option rendering, the preservation properties focus on ensuring selection logic, state management, row styling, and navigation behavior remain unchanged.
