import { isNotNullOrUndef } from '@/libs/utils/isNotNullorUndef';

export const atLeastOneExist = async (
    ...participants: any
) => {
    const [filtered] = participants.filter(
        isNotNullOrUndef
    );
    return !!filtered.length;
};
