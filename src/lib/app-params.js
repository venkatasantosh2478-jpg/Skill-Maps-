const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
	!isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
	window.localStorage.removeItem('skillsmap_access_token');
	window.localStorage.removeItem('token');
}

if (!isNode && isClearAccessTokenRequested()) {
	clearStoredAccessToken();
}

export const appParams = {
	get appId() {
		return "skills-map";
	},
	get token() {
		return typeof window !== "undefined" ? window.localStorage.getItem("skillsmap_access_token") : null;
	},
	get functionsVersion() {
		return "1.0.0";
	},
	get appBaseUrl() {
		return typeof window !== "undefined" ? window.location.origin : "";
	},
};
