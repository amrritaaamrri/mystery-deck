# Mystery Deck — GitHub Pages Release Plan

Mystery Deck is a Vite-built static game, so its GitHub Pages release will build `dist/public` after every push to `main`. The repository will use a dedicated GitHub Actions workflow with a build job and a dependent deploy job. The workflow needs read access to the repository plus Pages and identity-token permissions for deployment. [1] [2]

Because this is a project repository rather than a user-site repository, the production Vite build will set its base path to `/mystery-deck/`. The expected public address is `https://amrritaaamrri.github.io/mystery-deck/`. Vite documents this repository-path configuration for GitHub Pages projects. [1]

The gameplay animation will be recorded from the fully styled demonstration reading. It will show the opening table, two card flips, and a confirmed pair. The finished GIF will be stored as a GitHub release asset and embedded in the README from that release URL, keeping the project source tree light while making the preview directly visible on the repository page.

For GitHub Pages, the live game will use a self-contained visual fallback for the decorative tarot imagery while retaining the original generated imagery in the Manus preview. This avoids relying on platform-private media paths in the public static build.

## References

[1] [Vite: Deploying a Static Site — GitHub Pages](https://vite.dev/guide/static-deploy)

[2] [GitHub Docs: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
