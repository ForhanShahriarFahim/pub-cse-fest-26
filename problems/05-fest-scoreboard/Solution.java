import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int t = Integer.parseInt(st.nextToken());
        int p = Integer.parseInt(st.nextToken());
        int n = Integer.parseInt(st.nextToken());
        int[][] acTime = new int[t + 1][p];
        int[][] rejected = new int[t + 1][p];
        for (int[] row : acTime) Arrays.fill(row, -1);
        for (int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine());
            int minute = Integer.parseInt(st.nextToken());
            int team = Integer.parseInt(st.nextToken());
            int j = st.nextToken().charAt(0) - 'A';
            String verdict = st.nextToken();
            if (acTime[team][j] != -1) continue;
            if (verdict.equals("AC")) acTime[team][j] = minute;
            else if (!verdict.equals("CE")) rejected[team][j]++;
        }
        StringBuilder sb = new StringBuilder();
        int[] solved = new int[t + 1], penalty = new int[t + 1];
        for (int i = 1; i <= t; i++) {
            for (int j = 0; j < p; j++) {
                if (acTime[i][j] == -1) continue;
                solved[i]++;
                penalty[i] += acTime[i][j] + 20 * rejected[i][j];
            }
            sb.append(solved[i]).append(' ').append(penalty[i]).append('\n');
        }
        int best = 1;
        for (int i = 2; i <= t; i++)
            if (solved[i] > solved[best] || (solved[i] == solved[best] && penalty[i] < penalty[best]))
                best = i;
        sb.append(best).append('\n');
        System.out.print(sb);
    }
}
