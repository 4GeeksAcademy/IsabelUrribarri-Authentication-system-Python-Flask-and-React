const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			accessToken: null,
		},

		actions: {
			// Use getActions to call a function within a fuction
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			createUser: async (email, password) => {
				try {
					// Add user to database in backend.
					const resp = await fetch(process.env.BACKEND_URL + "/api/sign_up",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},

							body: JSON.stringify({
								"email": email,
								"password": password
							}),
						}
					);
					if (resp.status == 403) { alert('USER ALREADY EXISTS, REDIRECTED TO LOGIN.') }
					return resp;
				}
				catch (error) {
					console.log("Error from backend", error)
				}
			},


			getToken: async (email, password) => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "api/token",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},

							body: JSON.stringify({
								"email": email,
								"password": password
							}),
						}
					);
					const credentials = await resp.json()
					localStorage.setItem('access_token', JSON.stringify(credentials.access_token))
					getActions().syncStoreToLocalStorage()
					return credentials;
				}
				catch (error) {
					console.log("Error loading access token from backend", error)
				}
			},


			getUser: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/private", {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + localStorage.getItem('access_token')
						}
					});

					if (!resp.ok) {
						// Si hay un problema en la solicitud, muestra un mensaje de error
						throw Error("There was a problem in the login request");
					} else if (resp.status === 403) {
						// Si el token es inválido o está ausente, redirige a la página de inicio de sesión
						throw Error("Missing or invalid token");
					} else {
						// Si todo está bien, obtén la información del usuario
						const data = await resp.json();
						console.log("This is the data you requested", data);
						return data;
					}
				} catch (error) {
					console.log("Error getting user information", error);
				}
			},

			syncStoreToLocalStorage: () => {
				setStore({ 'accessToken': localStorage.getItem('access_token') })
			}
		}
	};
};

export default getState;