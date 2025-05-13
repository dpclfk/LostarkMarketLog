export const backgroundColor = (grade: string) => {
  const colorMap: Record<string, string> = {
    고급: "bg-[#8DF901]",
    희귀: "bg-[#00B0FA]",
    영웅: "bg-[#ce43fc]",
    전설: "bg-[#F99200]",
    유물: "bg-[#FA5D00]",
    고대: "bg-[#E3C7A1]",
  };

  return colorMap[grade];
};
