import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        long x = Long.parseLong(st.nextToken());
        long[] w = new long[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) w[i] = Long.parseLong(st.nextToken());
        Arrays.sort(w);
        int l = 0, r = n - 1, rickshaws = 0;
        while (l <= r) {
            if (l < r && w[l] + w[r] <= x) l++;
            r--;
            rickshaws++;
        }
        System.out.println(rickshaws);
    }
}
