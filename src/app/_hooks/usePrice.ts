import { Price } from "../_types/ApiResponse/Price";
import { useFetch } from "./useFetch";

type Props = {
  basePath: string;
};

export const usePrice = ({ basePath }: Props) => {
  const { data, error, isLoading, mutate } = useFetch<Price[]>(
    `/api/${basePath}/price`
  );
  return { data, error, isLoading, mutate };
};
