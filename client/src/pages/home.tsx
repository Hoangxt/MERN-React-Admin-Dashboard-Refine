import { Box, Typography, Stack } from "@pankod/refine-mui";
import { useList } from "@pankod/refine-core";

import { PieChart, PropertyReferrals, TotalRevenue } from "components";

const home = () => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        Dashboard
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Property for Sale"
          value={684}
          series={[75, 25]}
          colors={["#475be8", "#e4e8ef"]}
        />
        <PieChart
          title="Property for Rent"
          value={550}
          series={[75, 25]}
          colors={["#475ae8", "#e4b8ef"]}
        />
        <PieChart
          title="Total customers"
          value={5684}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Property for Cites"
          value={555}
          series={[75, 25]}
          colors={["#475be8", "#e4c8bf"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ sx: "column", lg: "row" }}
        gap={4}
      >
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>
    </Box>
  );
};

export default home;
