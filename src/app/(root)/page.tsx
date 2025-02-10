"use client";

import {
  Box,
  Button,
  Title,
  Text,
  Flex,
  Stack,
  Image,
  Timeline,
  TimelineItem,
} from "@mantine/core";
import Link from "next/link";
import c from "./page.module.css";
import NextImage from "next/image";
import {
  IconBrandInstagram,
  IconNumber1,
  IconNumber2,
  IconNumber3,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { supabase } from "../_libs/supabase";

const TopLandingPage = () => {
  const router = useRouter();
  const handleTestLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_TEST_EMAIL!,
      password: process.env.NEXT_PUBLIC_TEST_PASS!,
    });
    router.replace("/product");
  };

  return (
    <Box className={c.home}>
      <Flex className={c.header} align="center" justify="space-between" px={10}>
        <Image
          src={null}
          fallbackSrc="https://placehold.co/180x50?text=Placeholder"
          w={180}
          h={50}
          alt=""
        />

        <Button
          radius="xl"
          size="md"
          variant="outline"
          color="rgba(255,146,43,1)"
          bg="white"
          component={Link}
          href="/login"
        >
          ログイン
        </Button>
      </Flex>
      <main className={c.main}>
        <Title size={28}>複数店舗の価格をサッと比較するアプリ</Title>
        <Image
          component={NextImage}
          width={300}
          height={225}
          src="/lp_mockup.png"
          alt="LP用モックアップ画像"
        />
        <Box>
          <Text size="sm">あっちのスーパーでこれいくらだったっけ？</Text>
          <Text size="sm" mt={20}>
            商品や店舗ごとの価格を登録して、手軽に比較できるメモサービス。
          </Text>
          <Text size="sm">
            いつでもどこでも他店の価格をチェックして、賢いお買い物をサポートします！
          </Text>
        </Box>
        <Stack gap="lg" mt={30}>
          <Button
            type="button"
            variant="outline"
            bg="white"
            size="lg"
            radius="md"
            onClick={handleTestLogin}
          >
            ゲストでログイン
          </Button>
          <Button
            variant="filled"
            color="rgba(255,146,43,1)"
            size="lg"
            radius="md"
            component={Link}
            href="/signup"
          >
            新規登録
          </Button>
          <Button
            variant="outline"
            color="rgba(255,146,43,1)"
            bg="white"
            size="lg"
            radius="md"
            component={Link}
            href="/login"
          >
            ログイン
          </Button>
        </Stack>
        <Box>
          <Title order={3} mt={40} mb={20}>
            使い方
          </Title>
          <Timeline active={4} bulletSize={24} lineWidth={2}>
            <TimelineItem
              bullet={<IconNumber1 size={12} />}
              title="まずはお店の登録"
              fz={18}
            >
              <Text c="" size="sm" mt={10}>
                下のメニューのお店をクリックし、「追加する」からよく行くお店を登録してください
              </Text>
            </TimelineItem>
            <TimelineItem
              bullet={<IconNumber2 size={12} />}
              title="次に商品の登録"
              fz={18}
            >
              <Text c="" size="sm" mt={10}>
                メニューの商品をクリックし、+ボタンから商品を追加してください(カテゴリーは任意です)
              </Text>
            </TimelineItem>
            <TimelineItem
              bullet={<IconNumber3 size={12} />}
              title="価格の登録"
              fz={18}
            >
              <Text c="" size="sm" mt={10}>
                商品を追加したら、「追加する」ボタンからお店と価格を入力
              </Text>
            </TimelineItem>
          </Timeline>
        </Box>
        <Flex
          justify="center"
          className={c.contactBottom}
          component={Link}
          href="#"
        >
          <Text size="sm">お問い合わせ</Text>
          <IconBrandInstagram size={20} />
        </Flex>

        <Button
          component={Link}
          href={"#"}
          variant="white"
          className={c.instaIcon}
        >
          <IconBrandInstagram size={40} color="#fff" />
        </Button>
      </main>
    </Box>
  );
};

export default TopLandingPage;
