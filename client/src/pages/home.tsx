import { Box, Typography, Stack } from "@pankod/refine-mui";
import { useList } from "@pankod/refine-core";

import { PieChart, PropertyReferrals, TotalRevenue } from "components";

import { PropertyCard } from "components";

const Home = () => {
  const { data, isLoading, isError } = useList({
    resource: "properties",
    config: {
      pagination: {
        pageSize: 4,
      },
    },
  });

  const latestProperties = data?.data ?? [];

  if (isLoading) return <Typography>Loading...</Typography>;

  if (isError) return <Typography>Something went wrong!</Typography>;

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

      {/*  */}
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        borderRadius="25px"
        minWidth="100%"
        mt="25px"
        bgcolor="#fcfcfc"
        padding="20px"
      >
        <Typography fontSize={24} fontWeight={700} color="#11142d">
          Latest Properties
        </Typography>
        <Box mt={2} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {latestProperties.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              location={property.location}
              price={property.price}
              photo={property.photo}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
