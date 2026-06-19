import { AuthService } from "@/services/auth.service";
import { useRoute, useRouter } from "vue-router";

export function useLogout() {

    const router = useRouter();
    const route = useRoute();

    return () => {

        const lastRoute =
            route.fullPath;

        sessionStorage.setItem(
            "return_to",
            lastRoute
        );

        AuthService.removeAuth();

        router.push("/login");
    };
}