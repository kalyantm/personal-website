import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "~/utils/theme-provider";

export default function CampFire() {
  const theme = useTheme();
  const fireVariants = {
    dark: {
      opacity: 1,
      transition: {
        delay: 1,
        duration: 1.2,
        ease: [0.83, 0, 0.17, 1],
      },
    },
    light: {
      opacity: 0,
      transition: {
        duration: 1.2,
        ease: [0.83, 0, 0.17, 1],
      },
    },
  };
  return (
    <svg
      width="94"
      height="122"
      viewBox="0 0 94 122"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      y="462"
      x="82%"
      className="opacity-0 md:opacity-100"
    >
      <g filter="url(#filter0_d_334_616)">
        <path
          d="M22.1899 84.4809C21.8338 81.6705 26.8528 81.8553 28.611 82.4744L31.0189 86.0862V87.6914C28.9329 88.4888 29.4136 90.5007 27.0057 90.5007C24.5978 90.5007 22.546 87.2914 22.1899 84.4809Z"
          fill="#8F9AA8"
        />
        <path
          d="M22.1899 84.4809C21.8338 81.6705 26.8528 81.8553 28.611 82.4744L31.0189 86.0862V87.6914C28.9329 88.4888 29.4136 90.5007 27.0057 90.5007C24.5978 90.5007 22.546 87.2914 22.1899 84.4809Z"
          stroke="#8F9AA8"
        />
      </g>
      <g filter="url(#filter1_d_334_616)">
        <path
          d="M43.8594 83.6792C44.4377 81.4357 40.6378 79.6036 37.8396 80.4686L36.2344 81.6726C35.2214 84.3201 35.4751 85.0544 36.2344 86.0871C38.7169 87.1745 41.8227 86.1849 45.0632 86.0871L43.8594 83.6792Z"
          fill="#8F9AA8"
        />
        <path
          d="M43.8594 83.6792C44.4377 81.4357 40.6378 79.6036 37.8396 80.4686L36.2344 81.6726C35.2214 84.3201 35.4751 85.0544 36.2344 86.0871C38.7169 87.1745 41.8227 86.1849 45.0632 86.0871L43.8594 83.6792Z"
          stroke="#8F9AA8"
        />
      </g>
      <g filter="url(#filter2_d_334_616)">
        <path
          d="M37.4382 86.4884C36.8863 83.2065 35.4317 79.666 33.0238 79.666C30.6159 79.666 30.1269 81.4381 29.0106 82.8765C27.4397 85.3839 27.8611 86.4001 29.0106 88.0937C32.4703 88.7181 34.2964 88.2156 37.4382 86.4884Z"
          fill="#ACC6E3"
        />
        <path
          d="M37.4382 86.4884C36.8863 83.2065 35.4317 79.666 33.0238 79.666C30.6159 79.666 30.1269 81.4381 29.0106 82.8765C27.4397 85.3839 27.8611 86.4001 29.0106 88.0937C32.4703 88.7181 34.2964 88.2156 37.4382 86.4884Z"
          stroke="#ACC6E3"
        />
      </g>
      <g filter="url(#filter3_d_334_616)">
        <path
          d="M25.8012 94.9155C28.2877 92.8234 28.678 91.6755 27.8078 89.6984C26.0861 85.547 24.7353 83.7194 20.1828 83.2773C16.2675 84.822 15.1959 86.7058 13.7617 90.501C16.171 93.7205 19.3016 94.3645 25.8012 94.9155Z"
          fill="#C4C4C4"
        />
        <path
          d="M25.8012 94.9155C28.2877 92.8234 28.678 91.6755 27.8078 89.6984C26.0861 85.547 24.7353 83.7194 20.1828 83.2773C16.2675 84.822 15.1959 86.7058 13.7617 90.501C16.171 93.7205 19.3016 94.3645 25.8012 94.9155Z"
          stroke="#C4C4C4"
        />
      </g>
      <g filter="url(#filter4_d_334_616)">
        <path
          d="M57.5062 82.4752C55.3403 80.7529 54.1139 80.3779 51.8877 81.2713C49.4261 83.978 49.2516 85.0911 49.4798 86.8897C50.4933 88.2074 52.7715 88.1338 57.5062 87.6923V82.4752Z"
          fill="#ACC6E3"
        />
        <path
          d="M57.5062 82.4752C55.3403 80.7529 54.1139 80.3779 51.8877 81.2713C49.4261 83.978 49.2516 85.0911 49.4798 86.8897C50.4933 88.2074 52.7715 88.1338 57.5062 87.6923V82.4752Z"
          stroke="#ACC6E3"
        />
      </g>
      <g filter="url(#filter5_d_334_616)">
        <path
          d="M51.487 83.6788C49.9191 81.1876 48.2726 81.1853 45.066 81.6722C43.64 83.1317 43.3434 83.8176 43.4607 84.8827C43.3666 86.1917 44.1069 86.6428 45.8686 87.2906C49.0326 87.4764 50.3649 87.3502 51.487 86.488V83.6788Z"
          fill="#C4C4C4"
        />
        <path
          d="M51.487 83.6788C49.9191 81.1876 48.2726 81.1853 45.066 81.6722C43.64 83.1317 43.3434 83.8176 43.4607 84.8827C43.3666 86.1917 44.1069 86.6428 45.8686 87.2906C49.0326 87.4764 50.3649 87.3502 51.487 86.488V83.6788Z"
          stroke="#C4C4C4"
        />
      </g>
      <g filter="url(#filter6_d_334_616)">
        <path
          d="M65.9313 84.0801C60.117 78.3351 58.4485 79.9359 55.8984 84.0801C55.7485 86.1584 55.0955 85.6852 55.8984 87.6919C56.7012 89.6986 65.9313 87.6919 65.9313 87.6919V84.0801Z"
          fill="#8F9AA8"
        />
        <path
          d="M65.9313 84.0801C60.117 78.3351 58.4485 79.9359 55.8984 84.0801C55.7485 86.1584 55.0955 85.6852 55.8984 87.6919C56.7012 89.6986 65.9313 87.6919 65.9313 87.6919V84.0801Z"
          stroke="#8F9AA8"
        />
      </g>
      <g filter="url(#filter7_d_334_616)">
        <path
          d="M72.3539 84.4812C70.9018 83.5191 70.6439 82.8669 66.3341 82.4746C62.833 84.2186 62.4156 85.5084 63.1236 88.093C66.2255 89.1277 67.735 89.1182 70.3473 88.8957L72.3539 84.4812Z"
          fill="#ACC6E3"
        />
        <path
          d="M72.3539 84.4812C70.9018 83.5191 70.6439 82.8669 66.3341 82.4746C62.833 84.2186 62.4156 85.5084 63.1236 88.093C66.2255 89.1277 67.735 89.1182 70.3473 88.8957L72.3539 84.4812Z"
          stroke="#ACC6E3"
        />
      </g>
      <g filter="url(#filter8_d_334_616)">
        <path
          d="M69.1447 91.3026C68.2412 88.4886 68.0783 86.9466 70.3486 84.4802C73.4856 81.8396 75.1288 81.5748 77.9736 82.0723C79.0845 86.2082 79.6958 87.2862 80.7828 88.0921C85.562 90.1731 87.2874 88.2722 88.4078 91.3026C89.6905 94.7719 86.6468 97.9114 82.7894 98.9276L69.1447 91.3026Z"
          fill="#8F9AA8"
        />
        <path
          d="M69.1447 91.3026C68.2412 88.4886 68.0783 86.9466 70.3486 84.4802C73.4856 81.8396 75.1288 81.5748 77.9736 82.0723C79.0845 86.2082 79.6958 87.2862 80.7828 88.0921C85.562 90.1731 87.2874 88.2722 88.4078 91.3026C89.6905 94.7719 86.6468 97.9114 82.7894 98.9276L69.1447 91.3026Z"
          stroke="#8F9AA8"
        />
      </g>

      {/* Unlit fire */}
      <path
        d="M40.6464 93.4848C40.6464 93.4848 29.8947 88.0695 33.6164 82.2375C37.3382 76.4056 38.4741 79.038 41.4734 72.24C43.566 67.4969 33.6163 60.1596 27 57.6602C27 57.6602 40.2329 63.0755 41.887 68.9074C43.5411 74.7394 41.1897 75.1559 35.8139 80.9878C30.4381 86.8198 40.6464 93.4848 40.6464 93.4848Z"
        fill="var(--color-unlit-flame)"
        fillOpacity="0.35"
      />
      <path
        d="M41.8885 95.1511C41.8885 95.1511 38.5469 83.6508 38.5803 76.8222C38.5955 73.7143 38.9085 71.9746 39.4074 68.9075C40.4404 62.5566 43.1301 59.4596 43.9562 53.078C45.0661 44.5041 42.3021 31 42.3021 31C42.3021 31 46.1147 44.4304 45.1968 53.078C44.5175 59.4771 41.6931 62.5586 40.648 68.9075C40.1695 71.8141 39.5107 74.711 39.4074 77.6554C39.1654 84.553 41.8885 95.1511 41.8885 95.1511Z"
        fill="var(--color-unlit-flame)"
        fillOpacity="0.35"
      />
      <path
        d="M48.0898 93.0688C48.0898 93.0688 64.8026 86.2828 60.9092 80.1553C58.7275 76.7217 51.9668 79.6366 50.1575 75.99C47.9652 71.5714 50.6542 63.7906 53.4657 59.7435C56.4475 55.4515 60.0821 54.3281 60.0821 54.3281C60.0821 54.3281 56.2998 56.0979 54.2928 60.9932C52.8696 64.4646 49.9965 70.01 51.3981 73.4902C53.4342 78.5464 62.0947 74.9173 64.6309 79.7386C68.7511 87.5711 48.0898 93.0688 48.0898 93.0688Z"
        fill="var(--color-unlit-flame)"
        fillOpacity="0.35"
      />
      {/* End of unlit fire */}

      {/* Lit fire */}
      <AnimatePresence>
        {theme === "dark" && (
          <motion.g
            filter="url(#filter9_d_334_616)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
          >
            <path
              d="M68.132 24.4821C68.132 24.4821 73.1889 19.9916 73.3359 16.241C73.475 12.692 69.2884 8 69.2884 8C69.6969 11.0953 69.2872 12.3952 68.132 13.494C66.9768 14.5928 66.3054 21.0492 68.132 24.4821Z"
              fill="var(--color-flame-1)"
              stroke="var(--color-flame-1)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            <path
              d="M14.3393 48.875C14.3393 48.875 10.0053 47.3845 8.68005 45.4615C7.27681 43.4255 8.48022 40 8.48022 40C10.0646 42.2473 11.1139 42.818 13.0076 43.7548C14.9379 45.2605 13.4019 47.1553 14.3393 48.875Z"
              fill="var(--color-flame-1)"
              stroke="var(--color-flame-1)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            <path
              d="M33.6949 34C33.6949 34 29.8254 32.4039 29.1369 30.1C28.5604 28.1708 29.9915 25 29.9915 25C30.3761 27.9795 30.8461 28 32.5554 29.2C34.2646 30.4 34.1838 31.7792 33.6949 34Z"
              fill="var(--color-flame-1)"
              stroke="var(--color-flame-1)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            <path
              d="M17.1189 91.0254C24.9012 99.183 44.3777 100.534 44.3777 100.534C44.3777 100.534 68.4005 98.3576 77.3419 87.8557C81.5054 82.9657 83.4165 79.5123 84.949 73.2754C87.2718 63.8226 85.6491 57.4841 81.7794 48.5523C79.4591 43.1967 71.5169 34.571 70.4806 33.4577C76.6479 40.165 76.1311 57.6904 72.9044 65.0344C69.6584 72.4224 63.6526 79.9127 59.592 80.8826C59.8805 79.881 65.9312 67.5701 66.5652 63.7665C67.1991 59.963 65.4114 50.4274 62.7616 48.5523C62.0389 58.2745 59.2226 62.1376 51.9849 67.5701C51.9849 67.5701 59.0731 52.6928 59.592 44.1148C60.1108 35.5368 58.7948 30.3459 55.1545 22.5613C50.2581 12.0907 36.1367 1.00781 36.1367 1.00781C36.1367 1.00781 45.6456 28.2667 38.6724 38.4095C31.6992 48.5523 32.9671 70.7397 32.9671 70.7397C32.9671 70.7397 26.6278 69.4719 26.6278 59.963C26.6278 50.4541 28.4394 50.0328 26.6278 44.1148C24.9993 38.7952 19.0207 32.0702 19.0207 32.0702C19.0207 32.0702 23.4582 45.3827 19.0207 51.088C14.5832 56.7933 17.1189 70.7397 17.1189 70.7397L10.1457 58.6951C10.1457 58.6951 8.20332 81.6799 17.1189 91.0254Z"
              fill="var(--color-flame-1)"
            />
            <path
              d="M70.4806 33.4577C71.5169 34.571 79.4591 43.1967 81.7794 48.5523C85.6491 57.4841 87.2718 63.8226 84.949 73.2754C83.4165 79.5123 81.5054 82.9657 77.3419 87.8557C68.4005 98.3576 44.3777 100.534 44.3777 100.534C44.3777 100.534 24.9012 99.183 17.1189 91.0254C8.20332 81.6799 10.1457 58.6951 10.1457 58.6951L17.1189 70.7397C17.1189 70.7397 14.5832 56.7933 19.0207 51.088C23.4582 45.3827 19.0207 32.0702 19.0207 32.0702C19.0207 32.0702 24.9993 38.7952 26.6278 44.1148C28.4394 50.0328 26.6278 50.4541 26.6278 59.963C26.6278 69.4719 32.9671 70.7397 32.9671 70.7397C32.9671 70.7397 31.6992 48.5523 38.6724 38.4095C45.6456 28.2667 36.1367 1.00781 36.1367 1.00781C36.1367 1.00781 50.2581 12.0907 55.1545 22.5613C58.7948 30.3459 60.1108 35.5368 59.592 44.1148C59.0731 52.6928 51.9849 67.5701 51.9849 67.5701C59.2226 62.1376 62.0389 58.2745 62.7616 48.5523C65.4114 50.4274 67.1991 59.963 66.5652 63.7665C65.9312 67.5701 59.8805 79.881 59.592 80.8826C63.6526 79.9127 69.6584 72.4224 72.9044 65.0344C76.1311 57.6904 76.6479 40.165 70.4806 33.4577ZM70.4806 33.4577C70.4075 33.3792 70.3687 33.3381 70.3687 33.3381C70.4063 33.3776 70.4435 33.4174 70.4806 33.4577Z"
              stroke="var(--color-flame-1)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            <path
              d="M43.1111 97.365C32.0601 96.6938 23.839 93.9357 17.7541 84.6865C13.5625 78.3152 12.7178 71.246 13.3166 65.6687C16.2026 71.4262 17.8968 71.741 20.9237 72.0079C19.9536 67.9061 19.6816 64.6709 20.9237 52.9901C22.0459 48.1781 22.9746 46.7946 24.7273 44.7491C24.2162 52.1257 24.2785 56.4845 26.629 65.6687C28.2404 69.8788 31.0897 71.4946 37.4058 73.9097C40.1784 69.7891 39.9415 51.0883 39.9415 51.0883C39.9415 51.0883 39.5447 43.1041 48.1825 28.267C49.6177 22.0989 48.6759 18.9886 48.1825 17.4902C52.4805 20.8678 55.1557 30.1688 55.1557 34.6063C55.1557 39.0437 54.0674 48.8448 50.0843 57.4276C45.4917 68.8062 47.9682 70.0409 50.0843 72.0079C55.7698 70.3193 62.4053 62.5692 63.3968 61.8651C63.3968 61.8651 60.1125 69.6955 55.1557 73.9097C54.1116 76.4808 54.0062 78.4473 55.1557 83.4186C58.774 83.3053 61.45 81.9676 67.2003 77.7133C69.1165 76.3782 70.2927 75.4047 78.611 59.9633C80.3321 56.8036 80.333 53.6226 79.8789 47.2848C82.0319 51.2577 83.1522 53.906 82.4146 72.0079C80.1567 79.9533 77.3078 83.6218 69.1021 88.49C61.959 93.2046 53.8169 98.0152 43.1111 97.365Z"
              fill="var(--color-flame-2)"
              stroke="var(--color-flame-2)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            <path
              d="M45.0135 98.6332C51.3842 99.7747 68.4688 89.1243 68.4688 89.1243C74.5514 82.9165 75.9323 78.469 76.0759 69.4725C70.9363 77.1306 67.3095 80.1166 58.9599 82.1511C58.6153 77.357 57.93 75.2071 56.4241 69.4725C55.5878 73.3599 54.4209 75.2711 49.451 77.7136C46.9024 71.1876 46.0845 66.7455 46.2813 56.794L49.451 33.9727C44.9683 38.5811 44.2162 43.4274 38.6742 55.5262C36.6598 66.5913 36.1348 71.6476 36.7724 77.7136C29.9952 73.9197 27.1163 69.6217 23.46 58.0619C22.4318 65.1292 24.3391 75.4609 25.9957 82.1511C23.4801 82.7891 19.2157 75.8422 15.8528 73.91C15.8012 80.119 17.286 83.7097 24.0939 90.3921C34.9122 96.6652 38.6427 97.4916 45.0135 98.6332Z"
              fill="var(--color-flame-3)"
              stroke="var(--color-flame-3)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          </motion.g>
        )}
      </AnimatePresence>
      {/* End of lit fire */}

      <path
        d="M22.9023 80.4668C43.187 87.147 70.6803 86.9654 70.2528 87.3465C69.8252 87.7276 68.3959 93.3089 68.3959 93.3089L26.6161 91.933L22.9023 80.4668Z"
        fill="#672F0A"
        stroke="#672F0A"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M26.5137 83.2754L40.1584 85.282M30.9282 85.282L42.5663 86.8872M27.7176 86.8872L40.5597 88.4925M45.3755 86.4859L54.6058 87.6899"
        stroke="#522405"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M22.6764 80.4824C19.5138 80.8281 19.5742 88.1583 19.7665 94.1116L26.0713 90.8218C26.2708 85.5877 25.839 80.1368 22.6764 80.4824Z"
        fill="#D38E4B"
        stroke="#D38E4B"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M21.699 90.0983C20.0956 91.3925 20.0324 84.1659 21.6991 82.0721M22.5019 81.6708C23.8096 81.0092 23.9418 81.9376 24.5084 82.8747M24.5083 83.6772C24.874 86.4391 24.9252 87.824 23.7056 88.8943M22.616 83.6772C21.9107 84.4809 21.8207 85.3268 21.6991 86.8878M23.3043 84.8812C23.4675 86.7896 23.3128 87.6098 22.5019 88.493"
        stroke="#B3773C"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M68.3863 87.6965C65.2507 87.6127 63.6219 88.2527 63.0332 91.0484V97.3044L69.2705 97.321C70.221 89.9731 71.2439 87.5883 68.3863 87.6965Z"
        fill="#D38E4B"
        stroke="#D38E4B"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M66.2454 95.7188C64.6051 95.3038 65.1485 91.668 65.8441 90.903M66.6467 90.1003C67.1896 89.1862 67.8032 88.936 69.8572 89.2977M67.0481 91.7057C66.4111 92.5173 66.4441 92.9494 66.6467 93.7123"
        stroke="#B3773C"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M29.2491 87.706C21.62 90.8873 20.187 92.97 20.5438 96.9911L48.9506 105.348L64.0704 96.9911C63.1044 90.8514 64.4724 87.9297 68.6521 87.6897L29.2491 87.706Z"
        fill="#672F0A"
      />
      <path
        d="M64.0704 96.9911C58.1657 100.255 54.8552 102.084 48.9506 105.348M64.0704 96.9911L48.9506 105.348M64.0704 96.9911C63.1044 90.8514 64.4724 87.9297 68.6521 87.6897M48.9506 105.348L20.5438 96.9911C20.187 92.97 21.62 90.8873 29.2491 87.706L68.6521 87.6897M68.6521 87.6897C69.0309 87.668 72.0078 88.91 69.1986 87.7061L68.6521 87.6897Z"
        stroke="#4A2105"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M26.9149 93.7102L63.836 92.105M63.4347 94.5129L32.132 95.7168M28.9215 92.105L49.7899 91.3023M54.2044 91.3023L61.4281 90.901M38.1517 88.8944L56.211 88.0918M39.3557 90.0984L61.0268 89.2957M31.3294 98.526L56.211 97.7234M25.7109 90.901L34.9412 90.4997"
        stroke="#522405"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <g filter="url(#filter10_d_334_616)">
        <path
          d="M5.33431 96.923C6.13694 98.5283 9.58791 99.372 12.1567 99.3309C15.7693 97.5061 17.9948 95.2666 19.7817 93.3112L13.3606 90.502C9.24076 91.04 4.53168 95.3177 5.33431 96.923Z"
          fill="#8F9AA8"
        />
        <path
          d="M5.33431 96.923C6.13694 98.5283 9.58791 99.372 12.1567 99.3309C15.7693 97.5061 17.9948 95.2666 19.7817 93.3112L13.3606 90.502C9.24076 91.04 4.53168 95.3177 5.33431 96.923Z"
          stroke="#8F9AA8"
        />
      </g>
      <g filter="url(#filter11_d_334_616)">
        <path
          d="M35.8347 101.738C32.7674 99.0988 30.3833 98.4735 24.5979 99.3302L18.5781 105.751C20.3109 110.581 27.0421 109.353 35.8347 109.363V101.738Z"
          fill="#ACC6E3"
        />
        <path
          d="M35.8347 101.738C32.7674 99.0988 30.3833 98.4735 24.5979 99.3302L18.5781 105.751C20.3109 110.581 27.0421 109.353 35.8347 109.363V101.738Z"
          stroke="#ACC6E3"
        />
      </g>
      <g filter="url(#filter12_d_334_616)">
        <path
          d="M11.354 105.752C9.88694 101.389 11.8393 99.5734 16.1698 96.522C19.3241 93.9119 20.8649 93.2565 23.3935 92.9102C25.8354 95.4136 26.3565 96.8289 25.4 99.3312L18.979 107.358C15.279 107.437 13.4962 107.199 11.354 105.752Z"
          fill="#ACC6E3"
        />
        <path
          d="M25.4 99.3312C26.3565 96.8289 25.8354 95.4136 23.3935 92.9102C20.8649 93.2565 19.3241 93.9119 16.1698 96.522C11.8393 99.5734 9.88694 101.389 11.354 105.752C13.4962 107.199 15.279 107.437 18.979 107.358M25.4 99.3312C22.8925 102.466 21.4866 104.223 18.979 107.358M25.4 99.3312L18.979 107.358"
          stroke="#ACC6E3"
        />
      </g>
      <g filter="url(#filter13_d_334_616)">
        <path
          d="M65.1289 97.4458C67.7179 94.6834 66.6489 90.1565 70.346 88.6168C75.0698 86.6497 79.0048 90.5769 81.9842 94.6366C82.8891 97.5557 82.9797 99.3638 81.9842 103.064C79.1087 106.141 75.9274 106.423 69.5434 106.275C69.3589 102.291 67.9879 100.499 65.1289 97.4458Z"
          fill="#C4C4C4"
        />
        <path
          d="M65.1289 97.4458C67.7179 94.6834 66.6489 90.1565 70.346 88.6168C75.0698 86.6497 79.0048 90.5769 81.9842 94.6366C82.8891 97.5557 82.9797 99.3638 81.9842 103.064C79.1087 106.141 75.9274 106.423 69.5434 106.275C69.3589 102.291 67.9879 100.499 65.1289 97.4458Z"
          stroke="#C4C4C4"
        />
      </g>
      <g filter="url(#filter14_d_334_616)">
        <path
          d="M55.498 101.338L56.702 98.9297C59.6645 96.8363 61.3323 96.1728 64.327 96.5218C68.6248 100.331 69.4599 102.43 69.9454 106.153C65.6904 109.636 63.1555 110.406 58.3073 109.364L55.498 101.338Z"
          fill="#8F9AA8"
        />
        <path
          d="M55.498 101.338L56.702 98.9297C59.6645 96.8363 61.3323 96.1728 64.327 96.5218C68.6248 100.331 69.4599 102.43 69.9454 106.153C65.6904 109.636 63.1555 110.406 58.3073 109.364L55.498 101.338Z"
          stroke="#8F9AA8"
        />
      </g>
      <g filter="url(#filter15_d_334_616)">
        <path
          d="M32.6243 108.159C30.5372 102.511 37.6405 99.3336 44.6638 98.5273C48.5237 98.6472 50.3836 99.3209 53.0914 101.738C53.0914 101.738 57.1257 101.353 58.7098 102.942C61.2328 105.473 56.3019 111.771 56.3019 111.771C51.7901 112.958 49.0052 113.511 41.4532 113.376C36.9721 112.09 34.0125 111.916 32.6243 108.159Z"
          fill="#C4C4C4"
        />
        <path
          d="M32.6243 108.159C30.5372 102.511 37.6405 99.3336 44.6638 98.5273C48.5237 98.6472 50.3836 99.3209 53.0914 101.738C53.0914 101.738 57.1257 101.353 58.7098 102.942C61.2328 105.473 56.3019 111.771 56.3019 111.771C51.7901 112.958 49.0052 113.511 41.4532 113.376C36.9721 112.09 34.0125 111.916 32.6243 108.159Z"
          stroke="#C4C4C4"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_334_616"
          x="17.6719"
          y="81.5938"
          width="17.8477"
          height="17.4062"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_334_616"
          x="31.0664"
          y="79.75"
          width="18.793"
          height="15.3438"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_334_616"
          x="23.4844"
          y="79.166"
          width="18.5059"
          height="17.6855"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter3_d_334_616"
          x="9.19727"
          y="82.7676"
          width="23.5312"
          height="20.6641"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter4_d_334_616"
          x="44.9062"
          y="80.3027"
          width="17.0996"
          height="16.1777"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter5_d_334_616"
          x="38.9375"
          y="80.9199"
          width="17.0488"
          height="14.9453"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter6_d_334_616"
          x="51.0059"
          y="79.8477"
          width="19.4258"
          height="17.2363"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter7_d_334_616"
          x="58.334"
          y="81.9629"
          width="18.6523"
          height="15.5547"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter8_d_334_616"
          x="64.0234"
          y="81.3672"
          width="29.1816"
          height="26.0957"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter9_d_334_616"
          x="0.441406"
          y="0.283203"
          width="89.832"
          height="108.502"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter10_d_334_616"
          x="0.744141"
          y="89.9883"
          width="23.877"
          height="17.8438"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter11_d_334_616"
          x="14.0039"
          y="98.4707"
          width="26.3301"
          height="19.5254"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter12_d_334_616"
          x="6.37109"
          y="92.3809"
          width="23.9785"
          height="23.4902"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter13_d_334_616"
          x="60.4434"
          y="87.5938"
          width="26.7539"
          height="27.2109"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter14_d_334_616"
          x="50.957"
          y="95.9336"
          width="23.5195"
          height="22.3594"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
        <filter
          id="filter15_d_334_616"
          x="27.7539"
          y="98.0273"
          width="36.1738"
          height="23.8691"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_334_616"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_334_616"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
