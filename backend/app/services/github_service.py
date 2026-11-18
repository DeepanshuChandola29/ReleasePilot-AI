
from github import Github, GithubException


def compare_github_commits(
    owner: str,
    repo_name: str,
    base: str,
    head: str
):
    """
    Compare two commits or branches in a public GitHub repository.

    Args:
        owner: GitHub username or organization name.
        repo_name: Repository name.
        base: Starting (older) commit or branch.
        head: Target (newer) commit or branch.

    Returns:
        Dictionary containing commit comparison details and changed files.
    """

    try:
        # Connect to GitHub (no token required for public repositories)
        github = Github()

        # Get the repository
        repo = github.get_repo(f"{owner}/{repo_name}")

        # Compare base and head
        comparison = repo.compare(base, head)

        # Collect changed file details
        changed_files = []

        for file in comparison.files:
            changed_files.append({
                "filename": file.filename,
                "status": file.status,
                "additions": file.additions,
                "deletions": file.deletions,
                "changes": file.changes,
                "patch": file.patch or ""
            })

        # Calculate total additions and deletions from file details
        total_additions = sum(
            file["additions"] for file in changed_files
        )

        total_deletions = sum(
            file["deletions"] for file in changed_files
        )

        # Return comparison result
        return {
            "repository": f"{owner}/{repo_name}",
            "base_commit": base,
            "head_commit": head,
            "total_commits": comparison.total_commits,
            "total_files_changed": len(changed_files),
            "total_additions": total_additions,
            "total_deletions": total_deletions,
            "files": changed_files
        }

    except GithubException as error:
        message = error.data.get("message", str(error)) if error.data else str(error)

        raise ValueError(
            f"GitHub API error: {message}"
        ) from error

    except Exception as error:
        raise ValueError(
            f"Unable to compare commits: {str(error)}"
        ) from error
