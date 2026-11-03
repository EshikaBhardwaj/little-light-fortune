<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The Diwali experience is a single-route stage machine in src/routes/index.tsx; fortunes, links and pick logic live in src/lib/fortunes.ts (tested) so content can change without touching UI.
- Reuse the creator section on the homepage and final stage so agency destinations stay consistent.
- Use the official asset pointer for on-screen and exported brand signatures; the favicon uses the same original SVG so brand artwork remains intact.
- Route all synthesized sound through a faded master gain, gentle shared echo, and compressor so mute covers active effects and layered sounds remain controlled.
