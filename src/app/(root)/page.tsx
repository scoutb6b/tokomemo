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
  Blockquote,
} from "@mantine/core";
import Link from "next/link";
import c from "./page.module.css";
import NextImage from "next/image";
import {
  IconBrandInstagram,
  IconDotsVertical,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconUpload,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { supabase } from "../_libs/supabase";
import { motion } from "motion/react";

const scrollVariant = {
  from: { opacity: 0, y: 50 },
  to: { opacity: 1, y: 0 },
  transition: { delay: 1, duration: 0.8, ease: "easeIn" },
};
const TopLandingPage = () => {
  const router = useRouter();
  const handleTestLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_TEST_EMAIL!,
      password: process.env.NEXT_PUBLIC_TEST_PASS!,
    });
    router.replace("/products");
  };

  return (
    <Box className={c.home}>
      <header>
        <Flex
          className={c.header}
          align="center"
          justify="space-between"
          px={10}
        >
          <Image src="/logo.svg" w={200} h={40} alt="logo" />

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
      </header>
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
        <motion.div
          viewport={{ once: true }}
          variants={scrollVariant}
          initial="from"
          whileInView="to"
        >
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
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          variants={scrollVariant}
          initial="from"
          whileInView="to"
        >
          <Title order={2} mt={40} mb={20}>
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
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          variants={scrollVariant}
          initial="from"
          whileInView="to"
        >
          <Stack mt={30} gap={10}>
            <Text size="sm" ta="center" fw={700}>
              ＼まずはゲストユーザーで試してみる！／
            </Text>
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
          </Stack>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          variants={scrollVariant}
          initial="from"
          whileInView="to"
        >
          <Title order={2} mt={40} mb={20}>
            ホーム画面への登録
          </Title>
          <Text size="sm">
            よく使う場合は、 ホーム画面に登録しておくと便利です！
          </Text>

          <Box mt={24}>
            <Blockquote icon={<IconNumber1 />} color="#9d5554">
              <Text size="md">
                ブラウザの右上や下にある
                <IconUpload size={16} />
                や、
                <IconDotsVertical size={16} />
                のマークをクリック
              </Text>
            </Blockquote>

            <Blockquote icon={<IconNumber2 />} color="#9d5554">
              <Text size="md">ホーム画面に追加をクリック</Text>
            </Blockquote>

            <Blockquote icon={<IconNumber3 />} color="#9d5554">
              <Text size="md">追加するをクリック</Text>
            </Blockquote>
          </Box>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          variants={scrollVariant}
          initial="from"
          whileInView="to"
        >
          <Flex
            justify="center"
            className={c.contactBottom}
            component={Link}
            href="#"
          >
            <Text size="sm">お問い合わせ</Text>
            <IconBrandInstagram size={20} />
          </Flex>
        </motion.div>

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
