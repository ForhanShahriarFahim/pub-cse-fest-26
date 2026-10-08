import java.io.*;
import java.util.*;

public class Sol {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(br.readLine().trim());
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            long n = Long.parseLong(st.nextToken());
            long v = Long.parseLong(st.nextToken());
            long j = Long.parseLong(st.nextToken());
            long k = Long.parseLong(st.nextToken());
            long c = Long.parseLong(st.nextToken());
            long people = 3 * n + v + j;
            long packs = (people + k - 1) / k;
            sb.append(packs).append(' ').append(packs * c).append('\n');
        }
        System.out.print(sb);
    }
}
