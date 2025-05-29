export const TokenUtil = {
    /**
      * msg 배열의 각 요소별로 토큰 수를 계산하고 총합을 반환
      * @param {string[]} msg
      * @param {string} model
      * @returns {Promise<{ details: { text: string, tokens: number }[], total: number }>}
      */
      async getToknCnt(msg, model) {
        const { encoding_for_model } = await import("@dqbd/tiktoken");

        const enc = await encoding_for_model(model);
        const details = [];
        let total = 0;

        for (const text of msg) {
          const tokens = enc.encode(text || "");
          details.push({
            text,
            tokens: tokens.length
          });
          total += tokens.length;
        }

        enc.free();

        return {
          details,
          total
        };
    }
};