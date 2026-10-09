import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        final int M = 1000000;
        boolean[] composite = new boolean[M + 1];
        for (int i = 2; (long) i * i <= M; i++)
            if (!composite[i])
                for (int j = i * i; j <= M; j += i) composite[j] = true;
        int[] cnt = new int[M + 1];
        for (int i = 1; i <= M; i++) cnt[i] = cnt[i - 1] + (i >= 2 && !composite[i] ? 1 : 0);

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int q = Integer.parseInt(br.readLine().trim());
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < q; k++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int l = Integer.parseInt(st.nextToken());
            int r = Integer.parseInt(st.nextToken());
            sb.append(cnt[r] - cnt[l - 1]).append('\n');
        }
        System.out.print(sb);
    }
}
