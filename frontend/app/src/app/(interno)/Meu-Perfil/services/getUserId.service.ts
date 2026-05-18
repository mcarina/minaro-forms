import { api } from "@/app/services/api/Api"

export async function getMe() {
    const response = await api.get("/users/me")

    return response.data
}