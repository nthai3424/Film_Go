import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { HttpStatusCode, isAxiosError } from 'axios';
// import { getAxiosError } from './axios';

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (isAxiosError(error)) {
                if (error.status === HttpStatusCode.Unauthorized) {
                    //   logoutStorage();
                    //   window.location.href = routesMap.Login;
                }

                if (error.status === HttpStatusCode.Forbidden) {
                    // toast({
                    //     status: "error",
                    //     title: getAxiosError(error),
                    // });
                }
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            if (isAxiosError(error)) {
                if (error.status === HttpStatusCode.Forbidden) {
                    // toast({
                    //     status: "error",
                    //     title: getAxiosError(error),
                    // });
                }
            }
        },
    }),
    defaultOptions: {
        queries: {
            retry: 0,
        },
        mutations: {
            retry: 0,
        },
    },
});

export default queryClient;

// export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
//     Awaited<ReturnType<FnType>>;
// export type QueryConfig<T extends (...args: any[]) => any> = Omit<
//     ReturnType<T>,
//     "queryKey" | "queryFn"
// >;

// export type MutationConfig<
//     MutationFnType extends (...args: any) => Promise<any>
// > = UseMutationOptions<
//     ApiFnReturnType<MutationFnType>,
//     Error,
//     Parameters<MutationFnType>[0]
// >;
