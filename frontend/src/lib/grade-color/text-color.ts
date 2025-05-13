export const textColor = (grade: string) => {
  const colorMap: Record<string, string> = {
    고급: "text-[#8DF901]",
    희귀: "text-[#00B0FA]",
    영웅: "text-[#ce43fc]",
    전설: "text-[#F99200]",
    유물: "text-[#FA5D00]",
    고대: "text-[#E3C7A1]",
  };

  return colorMap[grade];
};
