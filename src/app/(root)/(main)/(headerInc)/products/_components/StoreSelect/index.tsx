"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { Store } from "@/app/_types/ApiResponse/Store";
import { NativeSelect } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type StoreSelect = Pick<Store, "id" | "name">;

type Props = {
  form: UseFormReturnType<{ storeId: string; price: string | number }>;
  showChoice: boolean;
};

export const StoreSelect: React.FC<Props> = ({ form, showChoice }) => {
  const { data } = useFetch<Store[]>("/api/stores");
  console.log(data);

  const storeArr =
    data && data.length > 0
      ? data.map((store: StoreSelect) => ({
          value: store.id,
          label: store.name,
        }))
      : [];

  const storeSelect = showChoice
    ? [{ value: "", label: "選択してください" }, ...storeArr]
    : storeArr;

  return (
    <NativeSelect
      size="md"
      radius="md"
      label="お店"
      data={storeSelect}
      {...form.getInputProps("storeId")}
      // value={form.getValues().storeId ?? ""}
      // onChange={(e) => form.setFieldValue("storeId", e.currentTarget.value)}
      disabled={form.submitting}
    />
  );
};
