import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int r = Integer.parseInt(st.nextToken()), c = Integer.parseInt(st.nextToken());
        char[][] g = new char[r][];
        int x = 0, y = 0;
        for (int i = 0; i < r; i++) {
            g[i] = br.readLine().trim().toCharArray();
            for (int j = 0; j < c; j++) if (g[i][j] == 'S') { x = i; y = j; }
        }
        br.readLine();
        String m = br.readLine().trim();
        boolean[][] seen = new boolean[r][c];
        seen[x][y] = true;
        int distinct = 1;
        for (char ch : m.toCharArray()) {
            int nx = x, ny = y;
            if (ch == 'U') nx--;
            else if (ch == 'D') nx++;
            else if (ch == 'L') ny--;
            else ny++;
            if (nx < 0 || nx >= r || ny < 0 || ny >= c || g[nx][ny] == '#') continue;
            x = nx; y = ny;
            if (!seen[x][y]) { seen[x][y] = true; distinct++; }
        }
        System.out.println((x + 1) + " " + (y + 1));
        System.out.println(distinct);
    }
}
