import { SWRConfiguration } from "swr";
import { Price } from "../_types/ApiResponse/Price";
import { useFetch } from "./useFetch";

type Props = {
  basePath: string;
};

export const usePrice = (
  { basePath }: Props,
  config?: SWRConfiguration<Price[] | undefined>
) => {
  const { data, error, isLoading, mutate } = useFetch<Price[]>(
    `/api/${basePath}/price`,
    config
  );
  return { data, error, isLoading, mutate };
};
