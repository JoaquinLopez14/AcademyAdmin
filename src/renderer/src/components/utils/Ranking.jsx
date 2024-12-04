export const calculateRanking = (couples) => {
    const validCouples = couples.filter(couple => couple.average > 0);

    const sortedCouples = validCouples.sort((a,b) => b.average - a.average);

    sortedCouples.forEach((couple, index) => {
        couple.rank = index + 1;
    });

    return sortedCouples
}