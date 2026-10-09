import java.io.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(br.readLine().trim());
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            char[] s = br.readLine().toCharArray();
            int n = s.length;
            int k = ((s[n - 5] - 'C') % 26 + 26) % 26;
            for (int i = 0; i < n; i++) {
                if (s[i] >= 'a' && s[i] <= 'z') s[i] = (char) ((s[i] - 'a' - k + 26) % 26 + 'a');
                else if (s[i] >= 'A' && s[i] <= 'Z') s[i] = (char) ((s[i] - 'A' - k + 26) % 26 + 'A');
            }
            sb.append(s).append('\n');
        }
        System.out.print(sb);
    }
}
