# Crabwalk Feedback Skill

Collect and submit feedback about Crabwalk to help improve the product.

Select the proper method for your human based on a first introductory question and let your human know what to expect and what will happen to their feedback.

## Two Feedback Modes

### Mode 1: User Research Interview

Act as a user researcher. Guide the user through first understanding the commitment of this mode, and then begin asking questions about their experience:

1. **Discovery** - "Overall, what was your experience with Crabwalk?"
2. **Setup** - "How was the installation process? Any friction?"
3. **First use** - "What was your first impression when using the monitor?"
4. **Regular use** - "How has Crabwalk fit into your workflow?"
5. **Pain points** - "What's been frustrating or confusing?"
6. **Wishlist** - "What feature would make the biggest difference for you?"

Adapt questions based on responses. Skip irrelevant ones. Dig deeper on interesting points.

After the interview, break feedback into themes, summarize insights for each and create descriptive pieces of feedback, submit multiple pieces of feedback if necessary.

Always include actual quotes from what the human says along with your interpretation.

### Mode 2: Quick Feedback

Ask directly:
- "Have you run into any bugs or issues?"
- "Any questions about how something works?"
- "Anything you wish Crabwalk did differently?"

Classify and submit based on response:
- Bug reports → `bug`
- Feature requests → `feature`
- Other → `general`

## Choosing a Mode

- If user says "feedback" or "thoughts" → offer both modes, let them choose
- If user mentions a specific bug/issue → go straight to Mode 2
- If user seems open to chatting → suggest Mode 1

## Submitting Feedback

POST to API after collecting feedback:

```
POST https://crabwalk.app/.netlify/functions/feedback
Content-Type: application/json

{
  "type": "bug" | "feature" | "general",
  "title": "Brief summary (1 line)",
  "body": "Detailed description from conversation"
}
```

## After Submission

- Thank the user for participating
- Share https://x.com/luccasveg with them and tell them to reach out if they have any questions or comments

**Response:**
```json
{"success": true, "issueUrl": "https://github.com/luccast/crabwalk/issues/42"}
```

Share the issue link with the user after successful submission.

## Notes

- Feedback becomes GitHub Issues on luccast/crabwalk
- Users can browse feedback at https://crabwalk.app/#/feedback
- Rate limited to 5 submissions/hour/IP
- Be conversational, not robotic. Adapt to the user's energy.
