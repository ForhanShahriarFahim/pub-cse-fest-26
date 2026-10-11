import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        int b = Integer.parseInt(st.nextToken());
        long[] dp = new long[b + 1];
        for (int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine());
            int c = Integer.parseInt(st.nextToken());
            long f = Long.parseLong(st.nextToken());
            for (int j = b; j >= c; j--)
                dp[j] = Math.max(dp[j], dp[j - c] + f);
        }
        System.out.println(dp[b]);
    }
}
