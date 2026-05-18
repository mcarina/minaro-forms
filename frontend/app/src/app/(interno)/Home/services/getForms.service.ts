import { api } from "@/app/services/api/Api"

export async function getForms() {
    const response = await api.get("/forms/me")

    return response.data
}