#include <stdio.h>
#include <string.h>

char s[1105];

int main(void) {
    int t;
    if (!fgets(s, sizeof s, stdin)) return 0;
    sscanf(s, "%d", &t);
    while (t--) {
        fgets(s, sizeof s, stdin);
        int n = strlen(s);
        while (n > 0 && (s[n - 1] == '\n' || s[n - 1] == '\r')) s[--n] = '\0';
        int k = (s[n - 5] - 'C' + 26) % 26;
        for (int i = 0; i < n; i++) {
            if (s[i] >= 'a' && s[i] <= 'z') s[i] = (s[i] - 'a' - k + 26) % 26 + 'a';
            else if (s[i] >= 'A' && s[i] <= 'Z') s[i] = (s[i] - 'A' - k + 26) % 26 + 'A';
        }
        puts(s);
    }
    return 0;
}
