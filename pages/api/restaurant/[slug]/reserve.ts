import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../utils/constants";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

export default async function handleReserve(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({
      errorMessage: "Restaurant not found",
    });
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return res.status(400).json({
      errorMessage: "Restaurant is not open at that time",
    });
  }

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    restaurant,
    res,
  });

  if (!searchTimesWithTables) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  const searchTimeWithTables = searchTimesWithTables.find((times) => {
    return times.date.toISOString() === new Date(`${day}T${time}`).toISOString();
  });

  if (!searchTimeWithTables) {
    return res.status(400).json({
      errorMessage: "No availability, cannot book",
    });
  }

  const tablesCount : {
    2: number[],
    4: number[]
  } = {
    2: [],
    4: []
  }

  searchTimeWithTables.tables.forEach(table =>{
    if(table.seats === 2){
        tablesCount[2].push(table.id)
    } else {
        tablesCount[4].push(table.id)
    }
  })

  return res.json({
    // searchTimeWithTables,
    tablesCount
  });
}