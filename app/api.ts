import { Octokit } from "octokit";

export type Settings = {
    sort: "indexed";
    order: "desc" | "asc"
    per_page: number
    page: number;
}

export type Query = {
    term: string;
    language: '' | "js" | "go" | "rust" | "c" | "c++" | "java" | "python" | "xml" // add more if needed
    repo: string
    in: '' | "file" | "path" | "file,path";
    label: string
    fork: '' | "only" | "true"
    user: string;
    org: string;
    path: string;
    size: string
    filename: string;
    extension: '' | 'css' | 'js' | 'c' | 'cpp' | 'java' | 'py' | 'html' | 'xml' | 'rs' | 'go';  // add more if needed
}

export type Item = {
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    repository: {
        id: number;
        node_id: string;
        name: string;
        full_name: string;
        description?: string | null;
        owner: {
            name?: string | null | undefined;
            email?: string | null | undefined;
            login: string;
            id: number;
            node_id: string;
            avatar_url: string;
            gravatar_id: string | null;
            url: string;
            html_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            starred_url: string;
            subscriptions_url: string;
            organizations_url: string;
            repos_url: string;
            events_url: string;
            received_events_url: string;
            type: string;
            site_admin: boolean;
            starred_at?: string | undefined;
            user_view_type?: string | undefined;
        };
    };
    /* there is more attributes */
}

export type Result = {
    items: Item[];
    total_count: number;
    incomplete_results: boolean;
}

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN
});

export default async function searchCode(params: Settings & { q: string }): Promise<Result> {
    const response = await octokit.request('GET /search/code', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            'accept': 'application/vnd.github+json'
        },
        ...params
    })

    if (response.status !== 200) {
        throw new Error("Invalid request")
    }

    return response.data
}